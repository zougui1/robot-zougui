import { nanoid } from 'nanoid';

import { ComponentId } from './ComponentId';
import { aliasProperties, resolveAliasedProperties } from './utils';
import { Reply } from '../../../Reply';
import { ReplyableInteraction } from '../../../types';
import { Cache } from '../../../../utils';

const customIdKey = '__customId__';

export class ComponentIdGenerator {
  readonly name: string;
  #options: Record<string, { alias: string }> = {};
  #aliases: Record<string, { option: string }> = {};
  #cache: Cache<Record<string, string>> = new Cache();

  constructor(name: string) {
    this.name = name;
  }

  option = <OptionName extends string>(name: OptionName, alias: string): ComponentIdGenerator => {
    this.#options[name] = { alias };
    this.#aliases[alias] = { option: name };

    return this;
  }

  create = (options: Record<string, string>): CreatedId => {
    const payload = aliasProperties(options, this.#options);

    const payloadId = ComponentId.encode({
      ...payload,
      n: this.name,
    });

    if (payloadId.length <= 100) {
      return {
        value: payloadId,
        type: 'payload',
        onceDeletedFromCache: undefined,
      };
    }

    const customId = nanoid();

    const generatedId = ComponentId.encode({
      n: this.name,
      [customIdKey]: customId,
    });

    this.#cache.set(customId, {...options});

    const onceDeletedFromCache = (callback: () => void): void => {
      const handleDelete = ({ key }: { key: string }) => {
        if (key === customId) {
          callback();
          this.#cache.off('delete', handleDelete);
        }
      }

      this.#cache.on('delete', handleDelete);
    }

    return {
      value: generatedId,
      type: 'generated',
      onceDeletedFromCache,
    };
  }

  destroy(): void {
    this.#cache.destroy();
  }

  resolveOptions = (interaction: ReplyableInteraction, options: unknown): Record<string, string> | undefined => {
    if (!options || typeof options !== 'object') {
      return;
    }

    if (customIdKey in options && typeof options[customIdKey] === 'string') {
      return this.getCachedOptions(options[customIdKey], interaction);
    }

    return resolveAliasedProperties(options, this.#aliases);
  }

  private getCachedOptions = (key: string, interaction: ReplyableInteraction): Record<string, string> | undefined => {
    const options = this.#cache.consume(key);

    if (options) {
      return options;
    }

    const reply = new Reply(interaction);
    reply.respondError('Could not perform this action');
  }
}

export interface CreatedId {
  value: string;
  type: 'payload' | 'generated';
  onceDeletedFromCache: ((callback: () => void) => void) | undefined;
}
