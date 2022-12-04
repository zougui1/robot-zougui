import path from 'node:path';

import { Furaffinity } from '../../Furaffinity';
import { isPathNameValid } from '../../../utils';

const submissionPathNameScheme = '/view/:id';

export const getSubmissionId = (url: string): string => {
  if (!Furaffinity.isValidUrl(url)) {
    throw new Error('Invalid URL');
  }

  if (!isPathNameValid(url, submissionPathNameScheme)) {
    throw new Error('Invalid submission URL');
  }

  return path.basename(url);
}
