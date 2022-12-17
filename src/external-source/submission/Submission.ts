import { findSubmission } from './queries';
import { getCategoryName } from './adapters';
import { ExternalSubmissionType } from './types';
import { SubmissionFile } from '../submission-file';

export class Submission {
  id: string;
  categoryName: string;
  readonly file: SubmissionFile;
  readonly original: ExternalSubmissionType;

  //#region static methods
  static find = async (url: string): Promise<Submission | undefined> => {
    return await findSubmission(url);
  }
  //#endregion

  constructor(submission: ExternalSubmissionType) {
    this.id = submission.id;
    this.file = new SubmissionFile(submission.file);
    this.original = submission;
    this.categoryName = getCategoryName(submission);
  }

  //#region type checks
  isStory = (): boolean => {
    return this.original.isStory();
  }
  //#endregion
}
