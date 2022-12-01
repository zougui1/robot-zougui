import { Client } from '@notionhq/client';
import { DateTime } from 'luxon';
import _ from 'radash';

import { StoryNotion } from '../story.notion';
import { Chapter } from '../chapter.model';
import { ReadTrace } from '../read-trace.model';
import { getFullPageList } from '../../../notion';
import env from '../../../env';

export class ReadEndNotion extends StoryNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  findChaptersById = async ({ ids }: { ids: string[] }): Promise<Chapter.Instance[]> => {
    const responses = await _.parallel(ids.length, ids, async id => {
      return await this.#client.pages.retrieve({ page_id: id });
    });

    return getFullPageList(responses, Chapter);
  }

  findReadingStories = async ({ name }: { name: string }): Promise<ReadTrace.Instance[]> => {
    const result = await this.#client.databases.query({
      database_id: env.notion.databases.readTrace.id,
      filter: {
        and: [
          {
            property: 'Name',
            title: {
              equals: name,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'Reading'
            },
          },
        ],
      },
    });

    return getFullPageList(result.results, ReadTrace);
  }

  stopReadingStory = async ({ storyId, startDate, endDate }: StopReadingStoryOptions): Promise<void> => {
    await this.#client.pages.update({
      page_id: storyId,
      properties: {
        Status: {
          select: {
            name: 'Read',
          },
        },

        Date: {
          date: {
            start: startDate.toISODate(),
            end: endDate.toISODate(),
          },
        },
      },
    });
  }
}

export interface StopReadingStoryOptions {
  storyId: string;
  startDate: DateTime;
  endDate: DateTime;
}
