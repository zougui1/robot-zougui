import { z } from 'zod';
import { SetRequired } from 'type-fest';

import { FapContentType } from './FapContentType';
import { Option } from '../../discord';

const contents = [
  FapContentType.Art,
  FapContentType.Story,
  FapContentType.Imagination,
  FapContentType.RP,
] as const;

export function createContentOption(options: SetRequired<CreateContentOptionOptions, 'defaultValue'>): ContentOptionWithDefault;
export function createContentOption(options?: CreateContentOptionOptions | undefined): ContentOptionWithoutDefault;
export function createContentOption(options?: CreateContentOptionOptions | undefined): ContentOption | ContentOptionWithoutDefault | ContentOptionWithDefault {
  const enumSchema = z.enum(contents);
  const schema = options?.defaultValue
    ? enumSchema.default(options.defaultValue)
    : enumSchema;

  return new Option('[content]')
    .description('The content type you fapped to')
    .schema(schema)
    .autocomplete(({ value }) => {
      const valueLower = value.toLowerCase();

      return contents.filter(content => content.toLowerCase().includes(valueLower));
    });
}

type ContentZodEnum = z.ZodEnum<[FapContentType.Art, FapContentType.Story, FapContentType.Imagination, FapContentType.RP]>;
export type ContentOption = Option<'[content]', ContentZodEnum | z.ZodDefault<ContentZodEnum>, void>;
export type ContentOptionWithoutDefault = Option<'[content]', ContentZodEnum, void>;
export type ContentOptionWithDefault = Option<'[content]', z.ZodDefault<ContentZodEnum>, void>;

export interface CreateContentOptionOptions {
  defaultValue?: FapContentType | undefined,
}
