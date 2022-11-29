import { SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';
import YAML from 'yaml';
import lzString from 'lz-string';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { executeAction } from './utils';
import { SelectMenuActionContext } from './types';
import { ProgramMiddleware } from '../types';
import { Reply } from '../../Reply';
import { Cache } from '../../../utils';

const customIdKey = '__customId__';

export class SelectMenu<Options extends Record<string, string>> {
  readonly name: string;
  #action: ((context: SelectMenuActionContext<Options>) => void | Promise<void>) | undefined;
  #options: OptionsMap<Options> = {} as OptionsMap<Options>;
  #aliases: Record<string, { option: string; }> = {};
  #middlewares: ProgramMiddleware[] = [];
  #cache: Cache<Options> = new Cache();

  constructor(name: string) {
    this.name = name;
  }

  option = <OptionName extends string>(name: OptionName, alias: string): SelectMenu<Options & { [K in OptionName]: string }> => {
    this.#options[name] = { alias };
    this.#aliases[alias] = { option: name };

    return this as any as SelectMenu<Options & { [K in OptionName]: string }>;
  }

  action = (callback: (context: SelectMenuActionContext<Options>) => void): this => {
    this.#action = callback;
    return this;
  }

  create = (options: Options): CreatedSelectMenuBuilder => {
    const payload = Object.entries(options).reduce((payload, [key, value]) => {
      const option = this.#options[key];

      if (option) {
        payload[option.alias] = value;
      }

      return payload;
    }, {} as Record<string, string>);

    const payloadId = lzString.compressToUTF16(YAML.stringify({
      ...payload,
      n: this.name,
    }));

    if (payloadId.length <= 100) {
      const builder = new SelectMenuBuilder().setCustomId(payloadId);

      return {
        builder,
        idType: 'payload',
        onceDeletedFromCache: undefined,
      };
    }

    const customId = nanoid();

    const generatedId = lzString.compressToUTF16(YAML.stringify({
      n: this.name,
      [customIdKey]: customId,
    }));

    this.#cache.set(customId, {...options});

    const builder = new SelectMenuBuilder().setCustomId(generatedId);

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
      builder,
      idType: 'generated',
      onceDeletedFromCache,
    };
  }

  execute = async (interaction: SelectMenuInteraction, aliasedOptions: any): Promise<void> => {
    if (!this.#action) {
      throw new Error(`No action for select menu ${this.name}`);
    }

    const options = aliasedOptions[customIdKey]
      ? this.getCachedOptions(aliasedOptions[customIdKey], interaction)
      : this.resolveAliasedOptions(aliasedOptions);

    if (!options) {
      return;
    }

    const schemaShape = Object.keys(this.#options).reduce((shape, key) => {
      shape[key] = z.string();
      return shape;
    }, {} as z.ZodRawShape);
    const schema = z.object(schemaShape);
    const result = schema.safeParse(options);

    if (result.success) {
      await executeAction({
        interaction,
        action: this.#action as (context: SelectMenuActionContext<Record<string, string>>) => void | Promise<void>,
        selectMenuName: String(aliasedOptions.n),
        values: options,
        middlewares: this.#middlewares,
      });
    } else {
      const reply = new Reply(interaction);
      await reply.respondError('This action can no longer be executed');
    }
  }

  addMiddlewares = (middlewares: ProgramMiddleware[]): this => {
    this.#middlewares = middlewares;
    return this;
  }

  private getCachedOptions = (key: string, interaction: SelectMenuInteraction): Options | undefined => {
    const options = this.#cache.consume(key);

    if (options) {
      return options;
    }

    const reply = new Reply(interaction);
    reply.respondError('Could not perform this action');
  }

  private resolveAliasedOptions = (aliasedOptions: any): any => {
    const options = Object.entries(aliasedOptions).reduce((options, [aliasName, value]) => {
      const alias = this.#aliases[aliasName];

      if (alias) {
        options[alias.option] = String(value);
      }

      return options;
    }, {} as Record<string, string>);

    return options;
  }
}

export type OptionsMap<Options extends Record<string, unknown>> = {
  [K in keyof Options]: {
    alias: string;
  };
}

export interface CreatedSelectMenuBuilder {
  builder: SelectMenuBuilder;
  idType: 'payload' | 'generated';
  onceDeletedFromCache: ((callback: () => void) => void) | undefined;
}
