import path from 'node:path';

import { isValidSubmissionUrl } from './isValidSubmissionUrl';

export const getSubmissionId = (url: string): string => {
  if (!isValidSubmissionUrl(url)) {
    throw new Error('Invalid submission URL');
  }

  return path.basename(url);
}
