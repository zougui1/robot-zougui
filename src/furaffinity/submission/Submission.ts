import { Rating, Category, Species, Gender, ISubmission } from 'furaffinity-api';
import { DateTime } from 'luxon';

import { findSubmission } from './queries';
import { Author } from '../author';

export class Submission {
  id: string;
  url: string;
  downloadUrl: string;
  title: string;
  publishedAt: DateTime;
  rating: Rating;
  keywords: string[];
  author: Author;
  description: string;
  category: Category;
  species: Species;
  gender: Gender;

  //#region static methods
  static find = async (idOrUrl: string): Promise<Submission | undefined> => {
    const maybeSubmission = await findSubmission(idOrUrl);

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
    this.publishedAt = DateTime.fromMillis(submission.posted);
    this.rating = submission.rating;
    this.keywords = submission.keywords;
    this.author = new Author(submission.author);
    this.description = submission.description;
    this.category = submission.content.category;
    this.species = submission.content.species;
    this.gender = submission.content.gender;
  }
}
