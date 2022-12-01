import { DateTime } from 'luxon';

import { ReadEndNotion } from './read-end.notion';
import { ReadTrace } from '../read-trace.model';
import { getOnePage } from '../../../notion';
import { getItemActionMessage } from '../../../utils';

export class ReadEndService {
  static readonly errorCodes = {
    storyNotFound: 'ERR_STORY_NOT_FOUND',
    storyNotUnique: 'ERR_STORY_NOT_UNIQUE',
  } as const;

  readonly #notion: ReadEndNotion = new ReadEndNotion();

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

  stopReadingStory = async ({ name }: StartReadingStoryOptions): Promise<StartReadingStoryResult> => {
    const date = DateTime.now();

    const story = await this.findUniqueStory({ name });
    await this.#notion.stopReadingStory({
      storyId: story.id,
      startDate: story.properties.Date.start,
      endDate: date,
    });
    const chapterIds = story.properties.Chapters.relationIds;
    const chapters = await this.#notion.findChaptersById({ ids: chapterIds });
    const chapterNumbers = chapters.map(chapter => chapter.properties.Index.number);

    return {
      message: getItemActionMessage({
        itemName: name,
        numbers: chapterNumbers,
        actionLabel: 'You finished reading',
        itemLabels: {
          singular: 'Chapter',
          plural: 'Chapters',
        },
      }),
    };
  }
}

export interface StartReadingStoryOptions {
  name: string;
}

export interface StartReadingStoryResult {
  message: string;
}
