import path from 'node:path';

import { Rating, Category, Species, Gender, ISubmission } from 'furaffinity-api';
import { DateTime } from 'luxon';

import { findSubmission } from './queries';
import { downloadSubmissionFile } from './utils';
import { Author } from '../author';

export class Submission {
  id: string;
  url: string;
  downloadUrl: string;
  title: string;
  fileName: string;
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
  //#endregion

  constructor(submission: ISubmission) {
    this.id = submission.id;
    this.url = submission.url;
    this.downloadUrl = submission.downloadUrl;
    this.title = submission.title;
    this.fileName = path.basename(submission.downloadUrl);
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

  downloadToDir = async (dirPath: string): Promise<{ destFile: string }> => {
    const destFile = path.join(dirPath, this.fileName);
    await downloadSubmissionFile(this.downloadUrl, destFile, this.category);
    return { destFile };
  }

  //#region category checks
  isStory = (): boolean => {
    return this.category === Category.Story;
  }
  //#endregion
}
