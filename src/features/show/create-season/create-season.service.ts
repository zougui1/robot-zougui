import { CreateSeasonNotion } from './create-season.notion';
import { Show } from '../show.model';
import { ShowSource } from '../enums';

export class CreateSeasonService {
  readonly #notion: CreateSeasonNotion = new CreateSeasonNotion();

  findShow = async ({ name, source }: FindShowOptions): Promise<Show.Instance> => {
    const shows = await this.#notion.findShowsByName(name);

    if (shows.length > 1) {
      throw new Error(`Cannot create new seasons for the show "${name}" as ${shows.length} shows with that name were found.`);
    }

    if (shows.length === 0) {
      return await this.#notion.createShow({ name, source });
    }

    return shows[0];
  }

  ensureUniqueShow = async (options: FindShowOptions): Promise<void> => {
    await this.findShow(options);
  }

  findMatchingShowNames = async ({ name }: { name: string }): Promise<string[]> => {
    const shows = await this.#notion.findMatchingShows({ name });
    return shows.map(show => show.properties.Name.text);
  }
}

export interface FindShowOptions {
  name: string;
  source?: ShowSource | undefined;
}
