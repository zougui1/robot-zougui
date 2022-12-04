import { StoryNotion, GetStoryListOptions } from './story.notion';
import { Chapter } from './chapter.model';
import { Story } from './story.model';
import { getOnePage } from '../../notion';
import { EphemeralCache } from '../../utils';

const chaptersCache = new EphemeralCache<Promise<Chapter.Instance[]>>({ timeout: 15000 });

export class StoryService {
  static readonly errorCodes = {
    storyNotFound: 'ERR_STORY_NOT_FOUND',
    storyNotUnique: 'ERR_STORY_NOT_UNIQUE',
  } as const;

  readonly #notion: StoryNotion = new StoryNotion();

  findMatchingStoryNames = async ({ name, reading }: FindMatchingStoryNamesOptions): Promise<string[]> => {
    const storys = await this.#notion.getStoryList({ name, reading, nameComparison: 'contains' });
    const storyNames = storys.map(page => page.properties.Name.text);

    return storyNames;
  }

  findChapters = chaptersCache.wrap(async (options: FindChaptersOptions): Promise<Chapter.Instance[]> => {
    const story = await this.findUniqueStory(options);
    return await this.#notion.findChapters({ storyId: story.id });
  });

  findUniqueStory = async (options: FindChaptersOptions): Promise<Story.Instance> => {
    const { name, reading, errorMessages } = options;

    const story = getOnePage(
      await this.#notion.getStoryList({ name, reading, nameComparison: 'equals' }),
      {
        notFound: {
          code: StoryService.errorCodes.storyNotFound,
          message: errorMessages.notFound,
        },
        notUnique: {
          code: StoryService.errorCodes.storyNotUnique,
          message: errorMessages.notUnique,
        },
      },
    );

    return story;
  }
}

export interface FindMatchingStoryNamesOptions {
  name: string;
  reading?: boolean | undefined;
}

export interface FindChaptersOptions {
  name: string;
  reading?: boolean | undefined;
  errorMessages: {
    notFound: (stories: Story.Instance[]) => string;
    notUnique: (stories: Story.Instance[]) => string;
  }
}
