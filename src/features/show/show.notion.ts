import { Client } from '@notionhq/client';
import createDebug from 'debug';

import { Show } from './show.model';
import { notion } from '../../env';
import { getFullPageList } from '../../notion';

const debug = createDebug('notion-trackers:watch:notion');

export class ShowNotion {
  #client: Client = new Client({ auth: notion.token });

  getShowList = async ({ name, watching, nameComparison }: GetShowListOptions): Promise<Show.Instance[]> => {
    debug(`Find the show "${name}" with status watching=${watching}`);

    const result = await this.#client.databases.query({
      database_id: notion.databases.shows.id,
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
}

export interface GetShowListOptions {
  name: string;
  watching: boolean;
  nameComparison: 'equals' | 'contains';
}
