export const safeSplit = (string: string, separator: string | RegExp, limit?: number | undefined): [string, ...(string | undefined)[]] => {
  return string.split(separator, limit) as [string, ...(string | undefined)[]];
}
