import { z } from 'zod';

import { Reply } from '../Reply';
import { ReplyableInteraction } from '../types';

export type ArgumentString = `<"${string}...">` | `["${string}..."]` | `<${string}...>` | `[${string}...]` | `<${string}>` | `[${string}]`;
export type SchemaOrDefault<Schema extends z.Schema | void, Default extends z.Schema> = Schema extends void ? Default : Schema;
export type MaybeOptional<Schema extends z.Schema, WrappedSchema extends z.Schema = Schema> = Schema extends z.ZodDefault<any> ? WrappedSchema : z.ZodOptional<WrappedSchema>;

export type FindArgumentSchema<ArgName extends ArgumentString, Schema extends z.Schema | void> =
  ArgName extends `<"${string}...">` ? RequiredArraySchema<Schema, z.ZodString> :
  ArgName extends `["${string}..."]` ? OptionalArraySchema<Schema, z.ZodString> :
  ArgName extends `<${string}...>` ? RequiredArraySchema<Schema, z.ZodString> :
  ArgName extends `[${string}...]` ? OptionalArraySchema<Schema, z.ZodString> :
  ArgName extends `<${string}>` ? RequiredSchema<Schema, z.ZodString> :
  ArgName extends `[${string}]` ? OptionalSchema<Schema, z.ZodString> : never;

export type OptionString = `<${string}>` | `[${string}]`;

export type FindOptionSchema<T extends OptionString, Schema extends z.Schema | void> =
  Schema extends z.ZodEffects<any> ? Schema :
  T extends `<${string}>` ? RequiredSchema<Schema, z.ZodString> :
  T extends `[${string}]` ? OptionalSchema<Schema, z.ZodString> : never;

export type IsOptional<T extends OptionString> = T extends `[${string}]` ? true : false;

export type RequiredSchema<T extends z.Schema | void, Default extends z.Schema> = (
  Exclude<SchemaOrDefault<T, Default>, z.ZodNullable<any> | z.ZodOptional<any>>
);

export type OptionalSchema<T extends z.Schema | void, Default extends z.Schema> = (
  MaybeOptional<SchemaOrDefault<T, Default>>
);

export type RequiredArraySchema<T extends z.Schema | void, Default extends z.Schema> = (
  z.ZodArray<SchemaOrDefault<T, Default>>
);

export type OptionalArraySchema<T extends z.Schema | void, Default extends z.Schema> = (
  MaybeOptional<SchemaOrDefault<T, Default>, z.ZodArray<SchemaOrDefault<T, Default>>>
);

export interface MiddlewareContext {
  interaction: ReplyableInteraction;
  reply: Reply;
}

export type Middleware = (context: MiddlewareContext) => void | Promise<void>;
