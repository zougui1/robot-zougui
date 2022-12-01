import { Client } from '@notionhq/client';
import { DateTime } from 'luxon';
import _ from 'radash';

import { ShowNotion } from '../show.notion';
import { Season } from '../season.model';
import { WatchTrace } from '../watch-trace.model';
import { getFullPageList } from '../../../notion';
import env from '../../../env';

export class WatchEndNotion extends ShowNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  findSeasonsById = async ({ ids }: { ids: string[] }): Promise<Season.Instance[]> => {
    const responses = await _.parallel(ids.length, ids, async id => {
      return await this.#client.pages.retrieve({ page_id: id });
    });

    return getFullPageList(responses, Season);
  }

  findWatchingShows = async ({ name }: { name: string }): Promise<WatchTrace.Instance[]> => {
    const result = await this.#client.databases.query({
      database_id: env.notion.databases.watchTrace.id,
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
              equals: 'Watching'
            },
          },
        ],
      },
    });

    return getFullPageList(result.results, WatchTrace);
  }

  stopWatchingShow = async ({ showId, startDate, endDate }: StopWatchingShowOptions): Promise<void> => {
    await this.#client.pages.update({
      page_id: showId,
      properties: {
        Status: {
          select: {
            name: 'Watched',
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

export interface StopWatchingShowOptions {
  showId: string;
  startDate: DateTime;
  endDate: DateTime;
}
