import { isFuraffinityId } from './isFuraffinityId';

export const getSafeFuraffinityId = (unsafeId: string): string => {
  if (!isFuraffinityId(unsafeId)) {
    throw new Error('Invalid furaffinity ID');
  }

  return unsafeId;
}
