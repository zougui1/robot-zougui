import { findSubmission } from './queries';
import { getSubmissionUrl, isValidSubmissionUrl } from './utils';
import { ContentType } from './ContentType';
import { SoFurrySubmission } from './internal-types';
import { SubmissionFile } from '../submission-file';

export class Submission {
  id: string;
  type: ContentType;
  title: string;
  author: string;
  authorId: string;
  description: string;
  width: string;
  height: string;
  isFavorite: boolean;
  file: SubmissionFile;

  //#region static methods
  static find = async (url: string): Promise<Submission | undefined> => {
    const { id, url: apiUrl } = getSubmissionUrl(url);
    const maybeSubmission = await findSubmission(apiUrl);

    if (maybeSubmission) {
      return new Submission({
        id,
        ...maybeSubmission,
      });
    }
  }

  static isValidUrl = (url: string): boolean => {
    return isValidSubmissionUrl(url);
  }
  //#endregion

  constructor(data: SoFurrySubmission) {
    this.id = data.id;
    this.type = data.contentType;
    this.title = data.title;
    this.author = data.author;
    this.authorId = data.authorID;
    this.description = data.description;
    this.width = data.width;
    this.height = data.height;
    this.isFavorite = data.isFavourite;
    this.file = new SubmissionFile(
      data.contentSourceUrl,
      data.fileName,
      data.fileExtension,
      data.contentType,
    );
  }

  //#region type checks
  isStory = (): boolean => {
    return this.type === ContentType.Story;
  }
  //#endregion
}
