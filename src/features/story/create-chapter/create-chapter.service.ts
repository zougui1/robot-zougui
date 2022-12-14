import path from 'node:path';

import fs from 'fs-extra';
import _ from 'radash';
import { DateTime } from 'luxon';
import createDebug from 'debug';
import chalk from 'chalk';

import { CreateChapterNotion } from './create-chapter.notion';
import { findChapterByUrl, downloadSubmission } from './utils';
import { StoryService } from '../story.service';
import { Chapter } from '../chapter.model';
import { ReadStartService } from '../read-start/read-start.service';
import { StartService as FapStartService } from '../../fap/start/start.service';
import { FapContentType } from '../../fap';
import { removeTrailingSlash, removeQueryString } from '../../../utils';
import env from '../../../env';

const debug = createDebug('robot-zougui:story:create-chapter:service');
const reWWW = /^https?:\/\/www./;

export class CreateChapterService extends StoryService {
  readonly #notion: CreateChapterNotion = new CreateChapterNotion();
  readonly #fapStart: FapStartService = new FapStartService();
  readonly #readStart: ReadStartService = new ReadStartService();

  createChapter = async (options: CreateChapterOptions): Promise<CreateChapterResult> => {
    const cleanUrl = removeTrailingSlash(removeQueryString(options.url));

    const similarChapters = await this.#notion.findChaptersBySimilarUrl(
      cleanUrl.replace(reWWW, ''),
    );
    const existingChapter = findChapterByUrl(similarChapters, cleanUrl);

    if (existingChapter) {
      //throw new Error(`The URL "${options.url}" has already been downloaded under the name "${existingChapter.properties.Name.text}"`);
    }

    const submission = await downloadSubmission(options.url, env.tempDir, {
      onProgress: state => options.onProgress(state.progressString),
    });

    try {
      const [fileError, fileUrl] = submission.filePath
        ? await _.try(options.getFileUrl)(await fs.readFile(submission.filePath), submission.data.file.getSpoileredName())
        : [];

      if (fileError) {
        debug(chalk.red('[ERROR]'), fileError);
      }

      const story = await this.findOrCreateStory(options.storyName);
      const chapters = await this.findChapters({
        name: options.storyName,
        errorMessages: {
          // this should not happen, for type safety
          notFound: () => `Cannot create a new chapter for the story "${options.storyName}" as it could not be found`,
          notUnique: stories => `Cannot create a new chapter for the story "${options.storyName}" as ${stories.length} stories with that name were found.`,
        },
      });

      if (options.index) {
        const indexAlreadyExists = chapters.some(chapter => {
          return chapter.properties.Index.number === options.index;
        });

        if (indexAlreadyExists) {
          throw new Error(`The story "${options.storyName}" already has a chapter at the index ${options.index}`);
        }
      }

      const index = options.index || (this.findLastChapterIndex(chapters) + 1);

      const name = options.chapterName
        ? `${options.storyName}: ${options.chapterName}; C${index}`
        : `${options.storyName}; C${index}`;

      await this.#notion.createChapter({
        name,
        index,
        storyId: story.id,
        url: cleanUrl,
        file: submission.filePath && fileUrl ? {
          url: fileUrl,
          name: `${name}${path.extname(submission.filePath)}`,
        } : undefined,
        words: submission.wordCount,
      });

      const maybeChapterName = options.chapterName
        ? `: "${options.chapterName}"`
        : '';

      const { message: readMessage } = await this.startReadingCreatedChapter({
        ...options,
        chapterIndex: index,
      });

      const { message: fapMessage } = await this.startFappingOnCreatedChapter(options);

      const creationMessage = `Created the chapter #${index}${maybeChapterName} of the story "${options.storyName}".`;

      return {
        message: `${creationMessage}\n${readMessage || ''}\n${fapMessage || ''}`.trim(),
      };
    } finally {
      if (submission.filePath) {
        try {
          await fs.remove(submission.filePath);
        } catch (error) {
          debug(chalk.red('[ERROR]'), error);
        }
      }
    }
  }

  private async startReadingCreatedChapter(options: StartReadingCreatedChapterOptions): Promise<StartReadingCreatedChapterResult> {
    if (!options.startRead) {
      return {};
    }

    const [error] = await _.try(this.#readStart.startReadingStory)({
      chapters: [options.chapterIndex],
      name: options.storyName,
      date: DateTime.now(),
    });

    if (error) {
      debug(chalk.red('[ERROR]'), error);

      return {
        message: 'But failed to start reading it',
      };
    }

    return {
      message: 'And started to read it',
    };
  }

  private async startFappingOnCreatedChapter(options: StartFappingOnCreatedChapterOptions): Promise<StartFappingOnCreatedChapterResult> {
    if (!options.startFap) {
      return {};
    }

    const [error] = await _.try(this.#fapStart.createFap)({
      content: FapContentType.Story,
      date: DateTime.now(),
    });

    if (error) {
      debug(chalk.red('[ERROR]'), error);

      return {
        message: 'But failed to start fapping on it',
      };
    }

    return {
      message: 'And started to fap on it',
    };
  }

  private async findOrCreateStory(storyName: string): Promise<{ id: string }> {
    const [story] = await this.#notion.getStoryList({ name: storyName, nameComparison: 'equals' });

    if (story) {
      return { id: story.id };
    }

    return await this.#notion.createStory({ name: storyName });
  }

  private findLastChapterIndex(chapters: Chapter.Instance[]): number {
    const lastChapter = _.max(chapters, chapter => chapter.properties.Index.number);
    return lastChapter?.properties.Index.number ?? 0;
  }
}

export interface CreateChapterOptions {
  storyName: string;
  url: string;
  chapterName?: string | undefined;
  index?: number | undefined;
  startRead?: boolean | undefined;
  startFap?: boolean | undefined;
  onProgress: (progress: string) => void;
  getFileUrl: (file: Buffer, name: string) => Promise<string | undefined>;
}

export interface CreateChapterResult {
  message: string;
}

interface StartReadingCreatedChapterOptions {
  storyName: string;
  chapterIndex: number;
  startRead?: boolean | undefined;
}

interface StartReadingCreatedChapterResult {
  message?: string | undefined;
}

interface StartFappingOnCreatedChapterOptions {
  startFap?: boolean | undefined;
}

interface StartFappingOnCreatedChapterResult {
  message?: string | undefined;
}
