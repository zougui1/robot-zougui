import { Client } from '@notionhq/client';
import createDebug from 'debug';

import { Show } from './show.model';
import { Season } from './season.model';
import env from '../../env';
import { getFullPageList } from '../../notion';

const debug = createDebug('robot-zougui:watch:notion');

export class ShowNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  getShowList = async ({ name, watching, nameComparison }: GetShowListOptions): Promise<Show.Instance[]> => {
    debug(`Find the show "${name}" with status watching=${watching}`);

    const result = await this.#client.databases.query({
      database_id: env.notion.databases.shows.id,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
      filter: {
        and: [
          {
            property: 'Watching',
            formula: {
              checkbox: {
                equals: watching
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

    return getFullPageList(result.results, Show);
  }

  findSeasons = async ({ showId }: FindShowSeasonsOptions): Promise<Season.Instance[]> => {
    const result = await this.#client.databases.query({
      database_id: env.notion.databases.seasons.id,
      sorts: [
        {
          property: 'Index',
          direction: 'ascending',
        },
      ],
      filter: {
        property: 'Show',
        relation: {
          contains: showId,
        },
      },
    });

    return getFullPageList(result.results, Season);
  }
}

export interface GetShowListOptions {
  name: string;
  watching: boolean;
  nameComparison: 'equals' | 'contains';
}

export interface FindShowSeasonsOptions {
  showId: string;
}
