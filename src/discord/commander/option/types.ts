import { z } from 'zod';

import type { Option } from './Option';
import { OptionString } from '../types';

export type AnyOption = Option<OptionString, z.ZodType, AnyZodEffects | void>;
export type AnyZodEffects = z.ZodEffects<any>;

export type OutputSchema<
  ActualSchema extends z.Schema,
  Trasnformer extends z.ZodEffects<any> | void = void,
> = Trasnformer extends void ? ActualSchema : Trasnformer;
