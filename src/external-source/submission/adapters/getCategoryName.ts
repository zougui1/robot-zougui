import { ExternalSubmissionType } from '../types';
import { Submission as FuraffinitySubmission } from '../../../furaffinity';
import { Submission as SoFurrySubmission, ReverseContentType } from '../../../sofurry';

export const getCategoryName = (submission: ExternalSubmissionType): string => {
  if (submission instanceof FuraffinitySubmission) {
    return submission.categoryName;
  }

  if (submission instanceof SoFurrySubmission) {
    return ReverseContentType[submission.type];
  }

  throw new Error('Invalid submission');
}
