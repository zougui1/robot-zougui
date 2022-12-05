import path from 'node:path';

import { Category } from 'furaffinity-api';

import { downloadSubmissionFile } from './utils';

const storyExtensions = ['.txt', '.doc', '.docx', '.pdf'];

export class SubmissionFile {
  url: string;
  name: string;
  extension: string;
  readonly #category: Category;

  constructor(url: string, category: Category) {
    this.url = url;
    this.name = path.basename(url);
    this.extension = path.extname(this.name);
    this.#category = category;
  }

  downloadToDir = async (dirPath: string, options?: DownloadToDirOptions | undefined): Promise<{ destFile: string }> => {
    const fileName = options?.spoiler
      ? this.getSpoileredName()
      : this.name;

    const destFile = path.join(dirPath, fileName);
    await downloadSubmissionFile(this.url, destFile, this.#category);

    return { destFile };
  }

  getSpoileredName = (): string => {
    return `SPOILER_${this.name}`;
  }

  //#region type checks
  isStory = (): boolean => {
    return storyExtensions.includes(this.extension);
  }
  //#endregion
}

export interface DownloadToDirOptions {
  spoiler?: boolean | undefined;
}
