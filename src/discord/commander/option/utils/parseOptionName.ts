import { z } from 'zod';

const unwrapType = (schema: z.Schema): any => {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrapType(schema.unwrap());
  }

  return schema;
}

const removeSuffix = (text: string, suffix: string): string => {
  return text.endsWith(suffix) ? text.slice(0, -suffix.length) : text;
}

const removePrefix = (text: string, prefix: string): string => {
  return text.startsWith(prefix) ? text.slice(prefix.length) : text;
}

const removeSurroundings = (text: string, prefix: string, suffix: string): string => {
  return removeSuffix(removePrefix(text, prefix), suffix);
}

export const parseOptionName = (option: string) => {
  const argNameWithoutEnclosing = removeSurroundings(removeSurroundings(option, '<', '>'), '[', ']');
  const unquotedArgName = removeSurroundings(argNameWithoutEnclosing, '"', '"');
  return removeSuffix(unquotedArgName, '...');
}
