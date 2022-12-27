import { z } from 'zod';
import { Constructor } from 'type-fest';
import createDebug from 'debug';

import { ComponentIdGenerator } from './id';
import { executeAction } from './utils';
import {
  ComponentBuilder,
  ComponentActionContext,
  CreatedComponent,
} from './types';
import { Middleware } from '../types';
import { ComponentInteraction } from '../../types';
import { Reply } from '../../Reply';

const debug = createDebug('robot-zougui:discord:component');

export class Component<
  Interaction extends ComponentInteraction = ComponentInteraction,
  Builder extends ComponentBuilder = ComponentBuilder,
  Options extends Record<string, string> = Record<string, string>,
> {
  readonly type: string;
  readonly name: string;
  #action: ((context: ComponentActionContext<Interaction, Options>) => void | Promise<void>) | undefined;
  #optionNames: string[] = [];
  #middlewares: Middleware[] = [];
  #idGenerator: ComponentIdGenerator;
  #Builder: Constructor<Builder>;

  constructor(type: string, Builder: Constructor<Builder>, name: string) {
    this.type = type;
    this.name = name;
    this.#Builder = Builder;
    this.#idGenerator = new ComponentIdGenerator(name);
  }

  option = <OptionName extends string>(name: OptionName, alias: string): AddOption<Interaction, Builder, Options, OptionName> => {
    this.#optionNames.push(name);
    this.#idGenerator.option(name, alias);

    return this as any as AddOption<Interaction, Builder, Options, OptionName>;
  }

  action = (callback: (context: ComponentActionContext<Interaction, Options>) => void): this => {
    this.#action = callback;
    return this;
  }

  create = (options: Options): CreatedComponent<Builder> => {
    const id = this.#idGenerator.create(options);
    const builder = new this.#Builder().setCustomId(id.value);

    return {
      builder,
      idType: id.type,
      onceDeletedFromCache: id.onceDeletedFromCache,
    };
  }

  execute = async (interaction: Interaction, aliasedOptions: unknown): Promise<void> => {
    if (!this.#action) {
      throw new Error(`No action for button ${this.name}`);
    }

    const options = this.#idGenerator.resolveOptions(interaction, aliasedOptions);

    if (!options) {
      return;
    }

    const schemaShape = this.#optionNames.reduce((shape, key) => {
      shape[key] = z.string();
      return shape;
    }, {} as z.ZodRawShape);
    const schema = z.object(schemaShape);
    const result = schema.safeParse(options);

    if (result.success) {
      await executeAction({
        componentType: this.type,
        interaction,
        action: this.#action as (context: ComponentActionContext<ComponentInteraction, Record<string, string>>) => void | Promise<void>,
        buttonName: this.name,
        values: options,
        middlewares: this.#middlewares,
      });
    } else {
      debug('Parse error', result.error);
      const reply = new Reply(interaction);
      await reply.respondError('This action can no longer be executed');
    }
  }

  addMiddlewares = (middlewares: Middleware[]): this => {
    this.#middlewares = middlewares;
    return this;
  }

  destroy(): void {
    this.#idGenerator.destroy();
  }
}

type AddOption<
  Interaction extends ComponentInteraction,
  Builder extends ComponentBuilder,
  Options extends Record<string, string>,
  NewOptionName extends string
> = Component<Interaction, Builder, Options & { [K in NewOptionName]: string }>;
