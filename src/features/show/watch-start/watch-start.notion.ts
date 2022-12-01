import { Client } from '@notionhq/client';
import _ from 'radash';
import { DateTime } from 'luxon';

import { ShowNotion } from '../show.notion';
import { Season } from '../season.model';
import env from '../../../env';
import { getFullPageList } from '../../../notion';

export class WatchStartNotion extends ShowNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

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

  startWatchingShow = async ({ name, seasonIds, date }: StartWatchingShowOptions): Promise<void> => {
    const seasons = seasonIds.map(id => ({ id }));

    await this.#client.pages.create({
      parent: { database_id: env.notion.databases.watchTrace.id },
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
            name: 'Watching',
          },
        },
        Seasons: {
          relation: seasons,
        },
      },
    });
  }
}

export interface FindShowSeasonsOptions {
  showId: string;
}

export interface StartWatchingShowOptions {
  name: string;
  seasonIds: string[];
  date: DateTime;
}
