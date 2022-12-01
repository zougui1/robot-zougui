import { DateTime } from 'luxon';

import { WatchEndNotion } from './watch-end.notion';
import { WatchTrace } from '../watch-trace.model';
import { getOnePage } from '../../../notion';
import { getItemActionMessage } from '../../../utils';

export class WatchEndService {
  static readonly errorCodes = {
    showNotFound: 'ERR_SHOW_NOT_FOUND',
    showNotUnique: 'ERR_SHOW_NOT_UNIQUE',
  } as const;

  readonly #notion: WatchEndNotion = new WatchEndNotion();

  findUniqueShow = async ({ name }: { name: string }): Promise<WatchTrace.Instance> => {
    const show = getOnePage(
      await this.#notion.findWatchingShows({ name }),
      {
        notFound: {
          code: WatchEndService.errorCodes.showNotFound,
          message: () => `Could not find a show named "${name}". Maybe you are not currently watching it.`,
        },
        notUnique: {
          code: WatchEndService.errorCodes.showNotUnique,
          message: shows => `Cannot stop watching the show "${name}" as ${shows.length} shows with that name were found.`,
        },
      },
    );

    return show;
  }

  stopWatchingShow = async ({ name }: StartWatchingShowOptions): Promise<StartWatchingShowResult> => {
    const date = DateTime.now();

    const show = await this.findUniqueShow({ name });
    await this.#notion.stopWatchingShow({
      showId: show.id,
      startDate: show.properties.Date.start,
      endDate: date,
    });
    const seasonIds = show.properties.Seasons.relationIds;
    const seasons = await this.#notion.findSeasonsById({ ids: seasonIds });
    const seasonNumbers = seasons.map(season => season.properties.Index.number);

    return {
      message: getItemActionMessage({
        itemName: name,
        numbers: seasonNumbers,
        actionLabel: 'You finished watching',
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
}

export interface StartWatchingShowResult {
  message: string;
}
