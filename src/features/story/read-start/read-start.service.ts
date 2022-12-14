import { DateTime } from 'luxon';

import { ReadStartNotion } from './read-start.notion';
import { StoryService } from '../story.service';
import { Chapter } from '../chapter.model';
import { FapContentType } from '../../fap';
import { StartService } from '../../fap/start/start.service';
import { filterPagesByNumbers, getItemActionMessage } from '../../../utils';

export class ReadStartService extends StoryService {
  readonly #notion: ReadStartNotion = new ReadStartNotion();
  readonly #fapStartService: StartService = new StartService();

  startReadingStory = async (options: StartReadingStoryOptions): Promise<StartReadingStoryResult> => {
    const { name, chapters: chapterNumbers, date, fapStart } = options;

    await Promise.all([
      this._startReadingStory(options),
      fapStart && this.#fapStartService.createFap({
        date,
        content: FapContentType.Story,
      }),
    ]);

    return {
      message: getItemActionMessage({
        itemName: name,
        numbers: chapterNumbers,
        actionLabel: fapStart ? 'You started fapping on' : 'You started reading',
        itemLabels: {
          singular: 'Chapter',
          plural: 'Chapters',
        },
      }),
    };
  }

  findNotReadingChapters = async ({ name }: { name: string }): Promise<Chapter.Instance[]> => {
    return await this.findChapters({
      name,
      reading: false,
      errorMessages: {
        notFound: () => `Could not find a story named "${name}". Maybe you are already reading it.`,
        notUnique: stories => `Cannot start reading the story "${name}" as ${stories.length} stories with that name were found.`,
      },
    });
  }

  private async _startReadingStory(options: StartReadingStoryOptions): Promise<void> {
    const { name, chapters: chapterNumbers, date } = options;
    const allChapters = await this.findNotReadingChapters({
      name,
    });

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
  fapStart?: boolean | undefined;
}

export interface StartReadingStoryResult {
  message: string;
}
