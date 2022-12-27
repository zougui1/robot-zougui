import { SeasonNotion } from './season.notion';
import { parseEpisodesDurations } from './utils';
import { CreateSeasonService } from '../create-season.service';

export class SeasonService {
  readonly #createSeason: CreateSeasonService = new CreateSeasonService();
  readonly #notion: SeasonNotion = new SeasonNotion();

  createSeason = async ({ name, index, episodesDurations: episodesDurationsStr }: CreateSeasonOptions): Promise<void> => {
    const show = await this.#createSeason.findShow({ name });
    const episodesDurations = parseEpisodesDurations(episodesDurationsStr);
    const minuteDuration = episodesDurations.reduce((totalDuration, duration) => {
      return totalDuration + duration;
    }, 0);
    const hourDuration = Number((minuteDuration / 60).toFixed(2));

    await this.#notion.createSeason({
      index,
      showId: show.id,
      name: `${name}; S${index}`,
      duration: hourDuration,
      episodeCount: episodesDurations.length,
    });
  }
}

export interface CreateSeasonOptions {
  name: string;
  index: number;
  episodesDurations: string;
}
