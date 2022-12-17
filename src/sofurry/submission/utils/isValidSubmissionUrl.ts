import { SoFurry } from '../../SoFurry';
import { isPathNameValid } from '../../../utils';

export const submissionUrlScheme = '/view/:id' as const;

export const isValidSubmissionUrl = (url: string): boolean => {
  return SoFurry.isValidUrl(url) && isPathNameValid(url, submissionUrlScheme);
}
