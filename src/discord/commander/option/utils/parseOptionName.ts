import { z } from 'zod';

import { removeSuffix, removePrefix } from '@zougui/common.string-utils';

const unwrapType = (schema: z.Schema): any => {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrapType(schema.unwrap());
  }

  return schema;
}

const removeSurroundings = (text: string, prefix: string, suffix: string): string => {
  return removeSuffix(removePrefix(text, prefix), suffix);
}

export const parseOptionName = (option: string) => {
  const argNameWithoutEnclosing = removeSurroundings(removeSurroundings(option, '<', '>'), '[', ']');
  const unquotedArgName = removeSurroundings(argNameWithoutEnclosing, '"', '"');
  return removeSuffix(unquotedArgName, '...');
}
