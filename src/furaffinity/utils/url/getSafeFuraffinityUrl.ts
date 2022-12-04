import { secureHttpProtocol } from '@zougui/common.url-utils';

import { isFuraffinityUrl } from './isFuraffinityUrl';

export const getSafeFuraffinityUrl = (unsafeUrl: string): string => {
  if (!isFuraffinityUrl(unsafeUrl)) {
    throw new Error('Invalid furaffinity URL');
  }

  return secureHttpProtocol(unsafeUrl);
}
