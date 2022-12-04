import { Client } from '@notionhq/client';
import createDebug from 'debug';

import { Story } from './story.model';
import { Chapter } from './chapter.model';
import env from '../../env';
import { getFullPageList } from '../../notion';

const debug = createDebug('robot-zougui:story:notion');

export class StoryNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  getStoryList = async ({ name, reading, nameComparison }: GetStoryListOptions): Promise<Story.Instance[]> => {
    debug(`Find the story "${name}" with status reading=${reading}`);

    const readingQuery = reading && {
      property: 'Reading',
      formula: {
        checkbox: {
          equals: reading
        },
      },
    };

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
          ...(readingQuery ? [readingQuery] :  []),
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

  findChapters = async ({ storyId }: FindChaptersOptions): Promise<Chapter.Instance[]> => {
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
}

export interface GetStoryListOptions {
  name: string;
  reading?: boolean | undefined;
  nameComparison: 'equals' | 'contains';
}

export interface FindChaptersOptions {
  storyId: string;
}
