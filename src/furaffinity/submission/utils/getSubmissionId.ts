import path from 'node:path';

import { Furaffinity } from '../../Furaffinity';

export const getSubmissionId = (idOrUrl: string): string => {
  if (Furaffinity.isValidUrl(idOrUrl)) {
    return path.basename(idOrUrl);
  }

  return Furaffinity.getSafeId(idOrUrl);
}
