import Emittery from 'emittery';

import { toMs, DurationString } from '@zougui/common.ms';

const defaultOptions = {
  timeout: '30 minutes',
  itemLimit: 100,
} satisfies CacheOptions;

export class Cache<T> extends Emittery<CacheEventMap> {
  #map: Map<string, T> = new Map();
  /**
   * used to keep track of the keys used in the map to remove the oldest entry in case the item limit is reached
   */
  #keys: string[] = [];
  /**
   * map containing the timeouts' ID for their related key
   */
  #timeoutIds: Map<string, NodeJS.Timeout> = new Map();
  #timeout: number;
  #itemLimit: number;

  constructor(options?: CacheOptions) {
    super();

    this.#timeout = toMs(options?.timeout ?? defaultOptions.timeout);
    this.#itemLimit = options?.itemLimit ?? defaultOptions.itemLimit;

    this.init();
  }

  set = (key: string, value: T): this => {
    if (this.hasReachedLimit() && !this.#map.has(key)) {
      this.deleteOldestEntry();
    }

    this.#map.set(key, value);
    this.setTimeout(key);

    return this;
  }

  get = (key: string): T | undefined => {
    return this.#map.get(key);
  }

  /**
   * returns the specified element and delete it
   */
  consume = (key: string): T | undefined => {
    const value = this.get(key);
    this.delete(key);

    return value;
  }

  delete = (key: string): this => {
    const hadKey = this.#map.has(key);
    this.#map.delete(key);

    if (hadKey) {
      this.emit('delete', { key });
    }

    return this;
  }

  destroy = (): void => {
    this.clearListeners();
  }

  private hasReachedLimit = (): boolean => {
    return this.#map.size >= this.#itemLimit;
  }

  private deleteOldestEntry = (): void => {
    const key = this.#keys.shift();

    if (key !== undefined) {
      this.delete(key);
    }
  }

  private setTimeout = (key: string): void => {
    const timeout = setTimeout(() => {
      this.delete(key);
    }, this.#timeout);

    this.#timeoutIds.set(key, timeout);
  }

  private init(): void {
    this.on('delete', ({ key }) => {
      clearTimeout(this.#timeoutIds.get(key));
    });
  }
}

export interface CacheOptions {
  /**
   * @default '30 minutes'
   */
  timeout?: number | DurationString | undefined;
  /**
   * @default 100
   */
  itemLimit?: number | undefined;
}

export interface CacheEventMap {
  delete: { key: string };
}
