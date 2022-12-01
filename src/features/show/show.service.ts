import { ShowNotion } from './show.notion';

export class ShowService {
  readonly #notion: ShowNotion = new ShowNotion();

  findMatchingShowNames = async ({ name, watching }: FindMatchingShowNamesOptions): Promise<string[]> => {
    const shows = await this.#notion.getShowList({ name, watching, nameComparison: 'contains' });
    const showNames = shows.map(page => page.properties.Name.text);

    return showNames;
  }
}

export interface FindMatchingShowNamesOptions {
  name: string;
  watching: boolean;
}
