const reFuraffinityId = /^[0-9]+$/;

export const isFuraffinityId = (id: string): boolean => {
  return reFuraffinityId.test(id);
}
