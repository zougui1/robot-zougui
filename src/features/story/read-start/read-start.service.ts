import { DateTime } from 'luxon';

import { ReadStartNotion } from './read-start.notion';
import { Story } from '../story.model';
import { Chapter } from '../chapter.model';
import { FapContentType } from '../../fap';
import { StartService } from '../../fap/start/start.service';
import { getOnePage } from '../../../notion';
import {
  EphemeralCache,
  filterPagesByNumbers,
  getItemActionMessage,
} from '../../../utils';

const chaptersCache = new EphemeralCache<Promise<Chapter.Instance[]>>({ timeout: 15000 });

export class ReadStartService {
  static readonly errorCodes = {
    storyNotFound: 'ERR_STORY_NOT_FOUND',
    storyNotUnique: 'ERR_STORY_NOT_UNIQUE',
  } as const;

  readonly #notion: ReadStartNotion = new ReadStartNotion();
  readonly #fapStartService: StartService = new StartService();

  findChapters = chaptersCache.wrap(async ({ name }: { name: string }): Promise<Chapter.Instance[]> => {
    const story = await this.findUniqueStory({ name });
    return await this.#notion.findChapters({ storyId: story.id });
  });

  findUniqueStory = async ({ name }: { name: string }): Promise<Story.Instance> => {
    const story = getOnePage(
      await this.#notion.getStoryList({ name, reading: false, nameComparison: 'equals' }),
      {
        notFound: {
          code: ReadStartService.errorCodes.storyNotFound,
          message: () => `Could not find a story named "${name}". Maybe you are already reading it.`,
        },
        notUnique: {
          code: ReadStartService.errorCodes.storyNotUnique,
          message: storys => `Cannot start reading the story "${name}" as ${storys.length} stories with that name were found.`,
        },
      },
    );

    return story;
  }

  startReadingStory = async (options: StartReadingStoryOptions): Promise<StartReadingStoryResult> => {
    const { name, chapters: chapterNumbers, date, fap } = options;

    await Promise.all([
      this._startReadingStory(options),
      fap && this.#fapStartService.createFap({
        date,
        content: FapContentType.Story,
      }),
    ]);

    return {
      message: getItemActionMessage({
        itemName: name,
        numbers: chapterNumbers,
        actionLabel: fap ? 'You started fapping on' : 'You started reading',
        itemLabels: {
          singular: 'Chapter',
          plural: 'Chapters',
        },
      }),
    };
  }

  private async _startReadingStory(options: StartReadingStoryOptions): Promise<void> {
    const { name, chapters: chapterNumbers, date } = options;
    const allChapters = await this.findChapters({ name });

    const chapters = filterPagesByNumbers(
      allChapters,
      chapterNumbers,
      chapter => chapter.properties.Index.number,
    );
    const chapterIds = chapters.map(chapter => chapter.id);

    await this.#notion.startReadingStory({ name, chapterIds, date });
  }
}

export interface StartReadingStoryOptions {
  name: string;
  chapters: number[];
  date: DateTime;
  fap?: boolean | undefined;
}

export interface StartReadingStoryResult {
  message: string;
}
