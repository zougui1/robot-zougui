import { Submission } from '../Submission';
import { Submission as FuraffinitySubmission } from '../../../furaffinity';
import { Submission as SoFurrySubmission } from '../../../sofurry';

export const findSubmission = async (url: string): Promise<Submission | undefined> => {
  if (FuraffinitySubmission.isValidUrl(url)) {
    const maybeSubmission = await FuraffinitySubmission.find(url);

    if (maybeSubmission) {
      return new Submission(maybeSubmission);
    }
  }

  if (SoFurrySubmission.isValidUrl(url)) {
    const maybeSubmission = await SoFurrySubmission.find(url);

    if (maybeSubmission) {
      return new Submission(maybeSubmission);
    }
  }

  throw new Error('Invalid submission URL');
}
