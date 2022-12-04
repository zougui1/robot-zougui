import Emittery from 'emittery';
import { nanoid } from 'nanoid';

export class Queue<T = unknown> extends Emittery<QueueEventMap<T>> {
  readonly #items: QueueItem<T>[] = [];
  #current: QueueItem<T> | undefined;

  run(func: QueuedFunction<T>): Promise<T> {
    const lastItem = this.#items.at(-1);
    const id = this.add(func);

    return this.awaitAndExecFirst(lastItem?.id || this.#current?.id, id);
  }

  private async awaitAndExecFirst(previousId: string | undefined, currentId: string): Promise<T> {
    if (previousId) {
      await this.await(previousId);
    }

    this.execFirst();
    return await this.await(currentId);
  }

  private await(id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.off('complete', onComplete);
        this.off('error', onError);
      }

      const onComplete = (event: QueueEventMap<T>['complete']): void => {
        if (event.id === id) {
          cleanup();
          resolve(event.value);
        }
      }

      const onError = (event: QueueEventMap<T>['error']): void => {
        if (event.id === id) {
          cleanup();
          reject(event.error);
        }
      }

      this.on('complete', onComplete);
      this.on('error', onError);
    });
  }

  private add(func: QueuedFunction<T>): string {
    const id = nanoid();

    this.#items.push({
      function: func,
      id,
    });

    return id;
  }

  private async execFirst(): Promise<void> {
    const item = this.#items.shift();

    if (!item) {
      return;
    }

    this.#current = item;

    try {
      await this.exec(item);
    } finally {
      this.#current = undefined;
    }
  }

  private async exec(item: QueueItem<T>): Promise<void> {
    try {
      const value = await item.function();
      this.emit('complete', { id: item.id, value });
    } catch (error) {
      this.emit('error', { id: item.id, error });
    }
  }
}

type QueuedFunction<T = unknown> = () => (T | Promise<T>);
type QueueItem<T = unknown> = {
  id: string;
  function: QueuedFunction<T>;
}

export interface QueueEventMap<T = unknown> {
  complete: { id: string;  value: T };
  error: { id: string; error: unknown };
}
