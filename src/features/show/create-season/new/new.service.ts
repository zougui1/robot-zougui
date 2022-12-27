import _ from 'radash';

import { CreateSeasonService } from '../create-season.service';
import { ShowNotion } from '../../show.notion';

export class NewService {
  readonly #createSeason: CreateSeasonService = new CreateSeasonService();
  readonly #showNotion: ShowNotion = new ShowNotion();

  findNewSeasonIndex = async ({ name }: { name: string }): Promise<number> => {
    const show = await this.#createSeason.findShow({ name });
    const seasons = await this.#showNotion.findSeasons({ showId: show.id });

    const lastSeason = _.max(seasons, season => season.properties.Index.number);

    if (!lastSeason) {
      return 1;
    }

    return lastSeason.properties.Index.number + 1;
  }
}
