import { DateTime } from 'luxon';

import { ReadEndNotion } from './read-end.notion';
import { ReadTrace } from '../read-trace.model';
import { EndService } from '../../fap/end/end.service';
import { FapContentType } from '../../fap';
import { getOnePage } from '../../../notion';
import { getItemActionMessage } from '../../../utils';

export class ReadEndService {
  static readonly errorCodes = {
    storyNotFound: 'ERR_STORY_NOT_FOUND',
    storyNotUnique: 'ERR_STORY_NOT_UNIQUE',
  } as const;

  readonly #notion: ReadEndNotion = new ReadEndNotion();
  readonly #fapEndService: EndService = new EndService();

  findUniqueStory = async ({ name }: { name: string }): Promise<ReadTrace.Instance> => {
    const story = getOnePage(
      await this.#notion.findReadingStories({ name }),
      {
        notFound: {
          code: ReadEndService.errorCodes.storyNotFound,
          message: () => `Could not find a story named "${name}". Maybe you are not currently reading it.`,
        },
        notUnique: {
          code: ReadEndService.errorCodes.storyNotUnique,
          message: stories => `Cannot stop reading the story "${name}" as ${stories.length} stories with that name were found.`,
        },
      },
    );

    return story;
  }

  stopReadingStory = async ({ name, date, fap }: StopReadingStoryOptions): Promise<StartReadingStoryResult> => {
    const [{ chapterNumbers }] = await Promise.all([
      this._stopReadingStory({ name, date }),
      fap && this.#fapEndService.finishLastFap({
        date,
        content: FapContentType.Story,
      }),
    ])

    return {
      message: getItemActionMessage({
        itemName: name,
        numbers: chapterNumbers,
        actionLabel: fap ? 'You finished fapping on' : 'You finished reading',
        itemLabels: {
          singular: 'Chapter',
          plural: 'Chapters',
        },
      }),
    };
  }

  private async _stopReadingStory({ name, date }: Omit<StopReadingStoryOptions, 'fap'>): Promise<{ chapterNumbers: number[] }> {
    const story = await this.findUniqueStory({ name });
    await this.#notion.stopReadingStory({
      storyId: story.id,
      startDate: story.properties.Date.start,
      endDate: date,
    });
    const chapterIds = story.properties.Chapters.relationIds;
    const chapters = await this.#notion.findChaptersById({ ids: chapterIds });
    const chapterNumbers = chapters.map(chapter => chapter.properties.Index.number);

    return { chapterNumbers };
  }
}

export interface StopReadingStoryOptions {
  date: DateTime;
  name: string;
  fap?: boolean | undefined;
}

export interface StartReadingStoryResult {
  message: string;
}
