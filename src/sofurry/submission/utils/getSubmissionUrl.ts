import { isValidSubmissionUrl, submissionUrlScheme } from './isValidSubmissionUrl';
import { parsePathParams } from '../../../utils';

export const getSubmissionUrl = (url: string): { url: string; id: string } => {
  if (!isValidSubmissionUrl(url)) {
    throw new Error('Invalid submission URL');
  }

  const { id } = parsePathParams(url, submissionUrlScheme);

  return {
    id,
    url: `https://api2.sofurry.com/std/getSubmissionDetails?id=${id}`,
  };
}
