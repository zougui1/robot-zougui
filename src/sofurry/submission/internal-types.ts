import { ContentType } from './ContentType';

export interface SoFurrySubmission {
  id: string;
  contentType: ContentType;
  title: string;
  author: string;
  authorID: string;
  description: string;
  fileName: string;
  fileExtension: string;
  width: string;
  height: string;
  contentSourceUrl: string;
  previewSourceUrl: string;
  thumbnailSourceUrl: string;
  isFavourite: boolean;
}
