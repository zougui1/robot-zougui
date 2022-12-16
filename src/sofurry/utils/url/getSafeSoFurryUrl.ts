import { secureHttpProtocol } from '@zougui/common.url-utils';

import { getIsSoFurryUrl } from './getIsSoFurryUrl';

export const getSafeSoFurryUrl = (unsafeUrl: string): string => {
  if (!getIsSoFurryUrl(unsafeUrl)) {
    throw new Error('Invalid sofurry URL');
  }

  return secureHttpProtocol(unsafeUrl);
}
