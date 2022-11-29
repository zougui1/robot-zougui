import { z } from 'zod';

import { Option } from '../option';

export const defaultOptions = [
  new Option('[debug]').description('Enable debug mode').schema(z.boolean().default(false)),
];

export type DefaultOptions = {
  debug: z.ZodDefault<z.ZodBoolean>;
};
