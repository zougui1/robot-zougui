import { z } from 'zod';

import { OptionOptions } from './types';
import { Option, OptionObject, AnyOption, AnyZodEffects } from '../option';
import { OptionString } from '../types';

export class OptionMap {
  readonly options: Record<string, AnyOption> = {};

  option = <
    OptionName extends OptionString,
    Schema extends z.Schema = z.ZodString,
    Trasnformer extends z.ZodEffects<any> | void = void,
  >(
    name: OptionName,
    description: string,
    options?: OptionOptions<OptionName, Schema, Trasnformer> | undefined
  ): this => {
    const option = new Option<OptionString, z.ZodType, AnyZodEffects | void>(name).description(description);

    if (options?.schema) {
      option.schema(options.schema);
    }

    return this.addOption(option);
  }

  addOption = (option: AnyOption): this => {
    const expectedSchema = option._schema ?? z.string();
    const finalSchema = option.isOptional && !expectedSchema.isOptional() ? expectedSchema.optional() : expectedSchema;

    option.schema(finalSchema);
    this.options[option.name] = option;

    return this;
  }

  get = (name: string): AnyOption | undefined => {
    return this.options[name];
  }

  /**
   * @returns the options in an array
   */
  asArray(): AnyOption[] {
    return Object.values(this.options);
  }

  /**
   * @returns the options converted to objects
   */
  toArray(): OptionObject[] {
    return this.asArray().map(option => option.toObject());
  }

  isEmpty(): boolean {
    return this.asArray().length === 0;
  }

  toSchema(): z.ZodObject<any> {
    const options = this.asArray();

    const schemaShape = options.reduce((shape, option) => {
      shape[option.name] = option.getSchema();
      return shape;
    }, {} as z.ZodRawShape);

    return z.object(schemaShape);
  }
}
