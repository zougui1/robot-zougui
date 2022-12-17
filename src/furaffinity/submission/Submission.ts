import { Rating, Category, Species, Gender, ISubmission } from 'furaffinity-api';
import { DateTime } from 'luxon';

import { findSubmission } from './queries';
import { isValidSubmissionUrl } from './utils';
import { Author } from '../author';
import { SubmissionFile } from '../submission-file';

export class Submission {
  id: string;
  url: string;
  file: SubmissionFile;
  title: string;
  publishedAt: DateTime;
  rating: Rating;
  keywords: string[];
  author: Author;
  description: string;
  category: Category;
  categoryName: string;
  species: Species;
  gender: Gender;

  //#region static methods
  static find = async (url: string): Promise<Submission | undefined> => {
    const maybeSubmission = await findSubmission(url);

    if (maybeSubmission) {
      return new Submission(maybeSubmission);
    }
  }

  static isValidUrl = (url: string): boolean => {
    return isValidSubmissionUrl(url);
  }
  //#endregion

  constructor(submission: ISubmission) {
    this.id = submission.id;
    this.url = submission.url;
    this.file = new SubmissionFile(submission.downloadUrl, submission.content.category);
    this.title = submission.title;
    this.publishedAt = DateTime.fromMillis(submission.posted);
    this.rating = submission.rating;
    this.keywords = submission.keywords;
    this.author = new Author(submission.author);
    this.description = submission.description;
    this.category = submission.content.category;
    this.categoryName = Category[submission.content.category];
    this.species = submission.content.species;
    this.gender = submission.content.gender;
  }

  //#region category checks
  isStory = (): boolean => {
    return this.category === Category.Story;
  }
  //#endregion
}
