import { Client } from '@notionhq/client';
import _ from 'radash';
import { DateTime } from 'luxon';

import { StoryNotion } from '../story.notion';
import { Chapter } from '../chapter.model';
import env from '../../../env';
import { getFullPageList } from '../../../notion';

export class ReadStartNotion extends StoryNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  findChapters = async ({ storyId }: FindStoryChaptersOptions): Promise<Chapter.Instance[]> => {
    const result = await this.#client.databases.query({
      database_id: env.notion.databases.chapters.id,
      sorts: [
        {
          property: 'Index',
          direction: 'ascending',
        },
      ],
      filter: {
        property: 'Story',
        relation: {
          contains: storyId,
        },
      },
    });

    return getFullPageList(result.results, Chapter);
  }

  startReadingStory = async ({ name, chapterIds, date }: StartReadingStoryOptions): Promise<void> => {
    const chapters = chapterIds.map(id => ({ id }));

    await this.#client.pages.create({
      parent: { database_id: env.notion.databases.readTrace.id },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Date: {
          date: {
            start: date.toISODate(),
            end: date.plus({ day: 4 }).toISODate(),
          },
        },
        Status: {
          select: {
            name: 'Reading',
          },
        },
        Chapters: {
          relation: chapters,
        },
        'Read Stats': {
          relation: [{ id: env.notion.stats.read.id }],
        },
      },
    });
  }
}

export interface FindStoryChaptersOptions {
  storyId: string;
}

export interface StartReadingStoryOptions {
  name: string;
  chapterIds: string[];
  date: DateTime;
}
