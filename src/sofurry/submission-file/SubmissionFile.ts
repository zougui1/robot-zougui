import path from 'node:path';

import { prefixWith } from '@zougui/common.string-utils';

import { downloadSubmissionFile } from './utils';
import type { ContentType } from '../submission';
import env from '../../env';

const storyExtensions = env.supportedStoryFileExtensions;

export class SubmissionFile {
  url: string;
  name: string;
  extension: string;
  readonly #type: ContentType;
  readonly #originalExtension: string;

  constructor(url: string, fileName: string, fileExtension: string, type: ContentType) {
    this.url = url;
    this.#originalExtension = prefixWith(fileExtension, '.');
    this.extension = getFileExtension(this.#originalExtension);
    this.name = fileName.split('.').slice(0, -1).join('.') + this.extension;
    this.#type = type;
  }

  downloadToDir = async (dirPath: string, options?: DownloadToDirOptions | undefined): Promise<{ destFile: string }> => {
    const fileName = options?.spoiler
      ? this.getSpoileredName()
      : this.name;

    const destFile = path.join(dirPath, fileName);
    await downloadSubmissionFile(this.url, destFile, this.#type);

    return { destFile };
  }

  getSpoileredName = (): string => {
    return `SPOILER_${this.name}`;
  }

  isEmptyExtension = (): boolean => {
    return isEmptyExtension(this.#originalExtension);
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

const getFileExtension = (extension: string): string => {
  return isEmptyExtension(extension) ? '.txt' : extension;
}

const isEmptyExtension = (extension: string): boolean => {
  return extension.length <= 1;
}
