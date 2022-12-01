import { DateTime } from 'luxon';

import { WatchStartNotion } from './watch-start.notion';
import { Show } from '../show.model';
import { Season } from '../season.model';
import { getOnePage } from '../../../notion';
import {
  EphemeralCache,
  filterPagesByNumbers,
  getItemActionMessage,
} from '../../../utils';

const seasonsCache = new EphemeralCache<Promise<Season.Instance[]>>({ timeout: 15000 });

export class WatchStartService {
  static readonly errorCodes = {
    showNotFound: 'ERR_SHOW_NOT_FOUND',
    showNotUnique: 'ERR_SHOW_NOT_UNIQUE',
  } as const;

  readonly #notion: WatchStartNotion = new WatchStartNotion();

  findSeasons = seasonsCache.wrap(async ({ name }: { name: string }): Promise<Season.Instance[]> => {
    const show = await this.findUniqueShow({ name });
    return await this.#notion.findSeasons({ showId: show.id });
  });

  findUniqueShow = async ({ name }: { name: string }): Promise<Show.Instance> => {
    const show = getOnePage(
      await this.#notion.getShowList({ name, watching: false, nameComparison: 'equals' }),
      {
        notFound: {
          code: WatchStartService.errorCodes.showNotFound,
          message: () => `Could not find a show named "${name}". Maybe you are already watching it.`,
        },
        notUnique: {
          code: WatchStartService.errorCodes.showNotUnique,
          message: shows => `Cannot start watching the show "${name}" as ${shows.length} shows with that name were found.`,
        },
      },
    );

    return show;
  }

  startWatchingShow = async ({ name, seasons: seasonNumbers }: StartWatchingShowOptions): Promise<StartWatchingShowResult> => {
    const date = DateTime.now();

    const allSeasons = await this.findSeasons({ name });

    const seasons = filterPagesByNumbers(
      allSeasons,
      seasonNumbers,
      season => season.properties.Index.number,
    );
    const seasonIds = seasons.map(season => season.id);

    await this.#notion.startWatchingShow({ name, seasonIds, date });

    return {
      message: getItemActionMessage({
        itemName: name,
        numbers: seasonNumbers,
        actionLabel: 'You started watching',
        itemLabels: {
          singular: 'Season',
          plural: 'Seasons',
        },
      }),
    };
  }
}

export interface StartWatchingShowOptions {
  name: string;
  seasons: number[];
}

export interface StartWatchingShowResult {
  message: string;
}
