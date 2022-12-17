import { Furaffinity } from '../../Furaffinity';
import { isPathNameValid } from '../../../utils';

const submissionPathNameScheme = '/view/:id';

export const isValidSubmissionUrl = (url: string): boolean => {
  return Furaffinity.isValidUrl(url) && isPathNameValid(url, submissionPathNameScheme);
}
