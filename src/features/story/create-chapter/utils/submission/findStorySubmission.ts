import { Submission } from '../../../../../external-source';

export const findStorySubmission = async (url: string): Promise<Submission> => {
  const submission = await Submission.find(url);

  if (!submission) {
    throw new Error('Submission not found');
  }

  if (!submission.isStory()) {
    throw new Error(`Expected the submission to be a story. Got "${submission.categoryName}" instead`);
  }

  return submission;
}
