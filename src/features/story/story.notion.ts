import { Client } from '@notionhq/client';
import createDebug from 'debug';

import { Story } from './story.model';
import env from '../../env';
import { getFullPageList } from '../../notion';

const debug = createDebug('robot-zougui:watch:notion');

export class StoryNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  getStoryList = async ({ name, reading, nameComparison }: GetStoryListOptions): Promise<Story.Instance[]> => {
    debug(`Find the story "${name}" with status reading=${reading}`);

    const result = await this.#client.databases.query({
      database_id: env.notion.databases.stories.id,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
      filter: {
        and: [
          {
            property: 'Reading',
            formula: {
              checkbox: {
                equals: reading
              },
            },
          },
          {
            property: 'Name',
            title: nameComparison === 'equals' ? {
              equals: name,
            } : { contains: name },
          },
        ],
      },
    });

    return getFullPageList(result.results, Story);
  }
}

export interface GetStoryListOptions {
  name: string;
  reading: boolean;
  nameComparison: 'equals' | 'contains';
}
