import { submission as furaffinityFindSubmission, ISubmission } from 'furaffinity-api';

import { getSubmissionId } from '../utils';
import { Furaffinity } from '../../Furaffinity';
import { tryRequest } from '../../utils';

export const findSubmission = async (idOrUrl: string): Promise<ISubmission | undefined> => {
  Furaffinity.checkIsLoggedIn();
  const id = getSubmissionId(idOrUrl);
  const [error, submission] = await tryRequest(furaffinityFindSubmission)(id);

  if (!error) {
    return submission;
  }
}
