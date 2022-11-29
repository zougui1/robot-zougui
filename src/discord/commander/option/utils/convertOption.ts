import { z } from 'zod';
import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ApplicationCommandBooleanOptionData,
  ApplicationCommandNumericOptionData,
  ApplicationCommandStringOptionData,
  ApplicationCommandSubGroupData,
  ApplicationCommandSubCommandData,
} from 'discord.js';

import type { Option } from '../Option';

const toBooleanJson = (option: Option): ApplicationCommandBooleanOptionData => {
  return {
    name: option.name,
    description: option._description,
    type: ApplicationCommandOptionType.Boolean,
    required: !option.isOptional,
  };
}

const toNumericJson = (option: Option, schema: z.Schema): ApplicationCommandNumericOptionData => {
  const numberSchema = schema as z.ZodNumber;
  const type = numberSchema.isInt
    ? ApplicationCommandOptionType.Integer
    : ApplicationCommandOptionType.Number;

  return {
    type,
    name: option.name,
    description: option._description,
    required: !option.isOptional,
    minValue: numberSchema.minValue ?? undefined,
    maxValue: numberSchema.maxValue ?? undefined,
  };
}

const toStringJson = (option: Option, schema: z.Schema): ApplicationCommandStringOptionData => {
  const stringSchema = schema as Partial<z.ZodString>;
  const enumSchema = schema as Partial<z.ZodEnum<[string, ...string[]]>>;

  return {
    name: option.name,
    description: option._description,
    type: ApplicationCommandOptionType.String,
    required: !option.isOptional,
    minLength: stringSchema.minLength ?? undefined,
    maxLength: stringSchema.maxLength ?? undefined,
    choices: enumSchema.options?.map(option => ({ name: option, value: option })),
    autocomplete: Boolean(option._autocomplete),
    // discord support autocomplete true but
    // the type does not have it
  } as unknown as ApplicationCommandStringOptionData;
}

const convertMap: Record<string, (option: Option<any, any, any>, schema: z.Schema) => Exclude<ApplicationCommandOptionData, ApplicationCommandSubGroupData | ApplicationCommandSubCommandData>> = {
  [z.boolean()._def.typeName]: toBooleanJson,
  [z.number()._def.typeName]: toNumericJson,
  [z.string()._def.typeName]: toStringJson,
  [z.enum([''])._def.typeName]: toStringJson,
};

const unwrapType = (schema: z.Schema): any => {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrapType(schema.unwrap());
  }

  if (schema instanceof z.ZodDefault) {
    return unwrapType(schema._def.innerType);
  }

  if (schema instanceof z.ZodEffects) {
    return unwrapType(schema.innerType());
  }

  return schema;
}

export const convertOption = (option: Option<any, any, any>, schema: z.ZodType): Exclude<ApplicationCommandOptionData, ApplicationCommandSubGroupData | ApplicationCommandSubCommandData> => {
  const schemaType = (unwrapType(schema)._def as any)?.typeName;

  if (!schemaType) {
    throw new Error('The schema has no typeName');
  }

  const convert = convertMap[schemaType];

  if (!convert) {
    throw new Error(`Schema of type ${schemaType} is not supported`);
  }

  return convert(option, schema);
}
