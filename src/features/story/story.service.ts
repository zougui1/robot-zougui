import { StoryNotion } from './story.notion';

export class StoryService {
  #notion: StoryNotion = new StoryNotion();

  findMatchingStoryNames = async ({ name, reading }: FindMatchingStoryNamesOptions): Promise<string[]> => {
    const storys = await this.#notion.getStoryList({ name, reading, nameComparison: 'contains' });
    const storyNames = storys.map(page => page.properties.Name.text);

    return storyNames;
  }
}

export interface FindMatchingStoryNamesOptions {
  name: string;
  reading: boolean;
}
