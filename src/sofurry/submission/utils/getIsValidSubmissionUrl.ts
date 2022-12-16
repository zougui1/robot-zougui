type ParsePathParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ParsePathParams<Rest>
    : T extends `${string}:${infer Param}?`
      ? { [K in Param]?: string | undefined }
      : T extends `${string}:${infer Param}?/${infer Rest}`
        ? { [K in Param]?: string | undefined } & ParsePathParams<Rest>
          : T extends `${string}:${infer Param}`
            ? { [K in Param]: string }
  : {};

// type-safe path param parser
export const parseParams = <T extends string>(path: T): ParsePathParams<T> => {
  return path as any;
}

const res = parseParams('/api/v1/:some/:other/')
