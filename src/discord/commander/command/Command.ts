import { z } from 'zod';
import {
  ChatInputCommandInteraction,
  ApplicationCommandDataResolvable,
  ApplicationCommandSubCommandData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';

import { OptionMap } from './OptionMap';
import { CommandMap } from './CommandMap';
import { executeAction } from './utils';
import { defaultOptions, DefaultOptions } from './defaultOptions';
import { ParseOption, OptionOptions, ActionContext } from './types';
import { Option, AnyOption, OutputSchema } from '../option';
import { FindOptionSchema, OptionString, ProgramMiddleware } from '../types';
import { getRawInteractionOptions } from '../../utils';

export class Command<Options extends Record<string, unknown> = DefaultOptions> {
  readonly name: string;
  readonly commands: CommandMap = new CommandMap();
  _description: string = '';
  readonly options: OptionMap = new OptionMap();
  #action: ((context: ActionContext<Options>) => void | Promise<void>) | undefined;
  #middlewares: ProgramMiddleware[] = [];

  constructor(name: string = 'lib') {
    this.name = name;
  }

  description(description: string): this {
    this._description = description;
    return this;
  }

  option = <
    OptionName extends OptionString,
    Schema extends z.Schema = z.ZodString,
    Trasnformer extends z.ZodEffects<any> | void = void,
  >(
    name: OptionName,
    description: string,
    options?: OptionOptions<OptionName, Schema, Trasnformer> | undefined
  ): Command<AddOption<Options, OptionName, Schema, Trasnformer>> => {
    this.checkNoSubCommandsAndOptions();
    this.options.option(name, description, options);

    return this as any as Command<AddOption<Options, OptionName, Schema, Trasnformer>>;
  }

  addOption = <
    OptionName extends OptionString,
    Schema extends z.ZodType = z.ZodString,
    Trasnformer extends z.ZodEffects<any> | void = void,
  >(
    option: Option<OptionName, Schema, Trasnformer>
  ): Command<AddOption<Options, OptionName, Schema, Trasnformer>> => {
    this.checkNoSubCommandsAndOptions();
    this.options.addOption(option as unknown as AnyOption);

    return this as any as Command<AddOption<Options, OptionName, Schema, Trasnformer>>;
  }

  addCommand(command: Command<any>): this {
    this.checkNoSubCommandsAndOptions();
    this.commands.add(command);
    return this;
  }

  checkNoSubCommandsAndOptions(): void {
    if (!this.options.isEmpty() && !this.commands.isEmpty()) {
      throw new Error('A command cannot have both options and sub-commands');
    }
  }

  action = (callback: (context: ActionContext<Options>) => void): this => {
    if (!this.commands.isEmpty()) {
      throw new Error('A command with sub-commands cannot have an action');
    }

    for (const option of defaultOptions) {
      this.addOption(option);
    }

    this.#action = callback;
    return this;
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.#action) {
      throw new Error(`No action for command ${this.name}`);
    }

    const optionsData = this.options.asArray();
    const schema = this.options.toSchema();
    const rawOptions = getRawInteractionOptions(interaction, optionsData);
    const result = schema.safeParse(rawOptions);

    if (result.success) {
      await executeAction({
        action: this.#action as (context: ActionContext<Record<string, unknown>>) => void | Promise<void>,
        values: result.data as Options,
        rawValues: rawOptions,
        interaction,
        middlewares: this.#middlewares,
      });
    } else {
      const label = '**Invalid options:**';
      const errors = result.error.errors.map(error => {
        return `- ${error.path.join('.')}: ${error.message}`;
      });
      await interaction.reply(`❌ ${label}\n${errors}`);
    }
  }

  toCommandObject(): ApplicationCommandDataResolvable {
    const subCommandsJson = this.commands.asArray().map(command => command.toSubCommandObject());

    return {
      name: this.name,
      type: ApplicationCommandType.ChatInput,
      description: this._description,
      options: subCommandsJson.length ? subCommandsJson : this.options.toArray(),
    };
  }

  toSubCommandObject(): ApplicationCommandSubCommandData {
    return {
      name: this.name,
      description: this._description,
      type: ApplicationCommandOptionType.Subcommand,
      options: this.options.toArray(),
    };
  }

  addMiddlewares = (middlewares: ProgramMiddleware[]): this => {
    this.#middlewares = middlewares;

    for (const command of this.commands.asArray()) {
      command.addMiddlewares(middlewares);
    }

    return this;
  }
}

type AddOption<
  Options extends Record<string, unknown>,
  OptionName extends OptionString,
  Schema extends z.Schema,
  Trasnformer extends z.ZodEffects<any> | void,
> = Options & ParseOption<OptionName, OutputSchema<FindOptionSchema<OptionName, Schema>, Trasnformer>>
