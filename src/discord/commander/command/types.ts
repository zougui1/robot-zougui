import { z } from 'zod';
import { ChatInputCommandInteraction } from 'discord.js';
import type { CamelCase } from 'type-fest';

import { OptionString } from '../types';
import { Reply } from '../../Reply';

export type ParseOptionName<T extends string> =
  T extends `<${infer R}>` ?  CamelCase<R> :
  T extends `[${infer R}]` ? CamelCase<R> :
  T extends `${infer R}` ? CamelCase<R> : never;

export type ParseOption<T extends string, TParser extends z.ZodSchema | undefined> =
  TParser extends z.ZodDefault<any> ? { [k in ParseOptionName<T>]: ParseArg<TParser> } :
  TParser extends z.ZodOptional<any> ? { [k in ParseOptionName<T>]?: ParseArg<TParser> | undefined } :
  { [k in ParseOptionName<T>]: ParseArg<TParser> };

export type ParseArg<TParser> = TParser extends z.ZodSchema ? z.infer<TParser> : string;

export interface OptionOptions<
  ArgName extends OptionString,
  Schema extends z.Schema = z.ZodString,
  Trasnformer extends z.ZodEffects<any> | void = void,
  > {
  schema?: Schema | undefined;
}

export interface ActionContext<Options extends Record<string, unknown>> {
  interaction: ChatInputCommandInteraction;
  options: Options;
  reply: Reply;
}

export interface CommandMiddlewareContext {
  interaction: ChatInputCommandInteraction;
  reply: Reply;
}
