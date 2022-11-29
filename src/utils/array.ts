export const compact = <T>(arr: T[]): Exclude<T, undefined | null>[] => {
  const compactArray = arr.filter(item => item !== undefined && item !== null);
  return compactArray as Exclude<T, undefined | null>[];
}

export const range = (start: number, end: number): number[] => {
  return new Array(end - start).fill(0).map((v, index) => start + index);
}
