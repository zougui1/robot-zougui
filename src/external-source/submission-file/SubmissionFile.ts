import { ExternalSubmissionFileType } from './types';

export class SubmissionFile {
  url: string;
  name: string;
  extension: string;
  readonly original: ExternalSubmissionFileType;

  constructor(submissionFile: ExternalSubmissionFileType) {
    this.url = submissionFile.url;
    this.name = submissionFile.name;
    this.extension = submissionFile.extension;
    this.original = submissionFile;
  }

  downloadToDir = (dirPath: string, options?: DownloadToDirOptions | undefined): Promise<{ destFile: string }> => {
    return this.original.downloadToDir(dirPath, options);
  }

  getSpoileredName = (): string => {
    return this.original.getSpoileredName();
  }

  isEmptyExtension = (): boolean => {
    return this.original.isEmptyExtension();
  }

  //#region type checks
  isStory = (): boolean => {
    return this.original.isStory();
  }
  //#endregion
}

export interface DownloadToDirOptions {
  spoiler?: boolean | undefined;
}
