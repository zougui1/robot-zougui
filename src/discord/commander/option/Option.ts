import { z } from 'zod';
import {
  ApplicationCommandOptionData,
  ApplicationCommandSubGroupData,
  ApplicationCommandSubCommandData,
  AutocompleteInteraction,
} from 'discord.js';

import { convertOption, parseOptionName } from './utils';
import { OutputSchema, AnyOption } from './types';
import { FindOptionSchema, OptionString, IsOptional } from '../types';

export class Option<
  OptionName extends OptionString = OptionString,
  Schema extends z.Schema = z.ZodString,
  Transformer extends z.ZodEffects<any> | void = void,
> {
  readonly _optionName: OptionName;
  readonly name: string;
  readonly alias: string | undefined;
  readonly valueName: string | undefined;
  readonly isOptional: boolean | undefined;
  _schema: Schema = z.string() as any as Schema;
  _description: string = '';
  // @ts-ignore
  _autocomplete: AutocompleteHandler<this> | undefined;

  constructor(optionName: OptionName) {
    this.name = parseOptionName(optionName);
    this._optionName = optionName;
    this.isOptional = optionName.startsWith('[');
  }

  description(description: string): this {
    this._description = description;
    return this;
  }

  schema<NewSchema extends z.Schema>(schema: NewSchema): Option<OptionName, NewSchema, Transformer> {
    const newArgument = this as any as Option<OptionName, NewSchema, Transformer>;
    newArgument._schema = schema;
    return newArgument;
  }

  addTransform<NewTransformer>(transform: (arg: z.infer<FindOptionSchema<OptionName, Schema>>) => NewTransformer): Option<OptionName, z.ZodEffects<Schema, IsOptional<OptionName> extends true ? (NewTransformer | undefined) : NewTransformer, IsOptional<OptionName> extends true ? (NewTransformer | undefined) : NewTransformer>, Transformer> {
    const newArgument = this as any as Option<OptionName, z.ZodEffects<Schema, IsOptional<OptionName> extends true ? (NewTransformer | undefined) : NewTransformer, IsOptional<OptionName> extends true ? (NewTransformer | undefined) : NewTransformer>, Transformer>;
    newArgument._schema = this._schema.transform(transform);
    return newArgument as any;
  }

  // @ts-ignore
  autocomplete(listener:AutocompleteHandler<this>): this {
    this._autocomplete = listener;
    return this;
  }

  // TODO fix types
  getSchema(): OutputSchema<Schema, Transformer> {
    return this._schema as OutputSchema<Schema, Transformer>;
  }

  toObject(): OptionObject {
    return convertOption(this, this._schema);
  }
}

export interface ArgumentOptions<
  OptionName extends OptionString,
  Schema extends z.Schema,
  Transformer extends z.ZodEffects<any> | void = void,
> {
  transform?: ((schema: FindOptionSchema<OptionName, Schema>) => Transformer) | undefined;
}

export type OptionObject = Exclude<ApplicationCommandOptionData, ApplicationCommandSubGroupData | ApplicationCommandSubCommandData>;
export type AutocompleteHandler<Option extends AnyOption> = ({ interaction }: AutocompleteContext<Option>) => AutocompletionOption[] | Promise<AutocompletionOption[]>;
export type AutocompleteContext<Option extends AnyOption> = {
  option: Option;
  interaction: AutocompleteInteraction;
  value: string;
};
export type AutocompletionOption = string | {
  name: string;
  value: string;
}
