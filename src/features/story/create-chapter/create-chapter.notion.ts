import { DateTime } from 'luxon';
import { Client } from '@notionhq/client';
import createDebug from 'debug';

import { Chapter } from '../chapter.model';
import { StoryNotion } from '../story.notion';
import { getFullPageList } from '../../../notion';
import env from '../../../env';

const debug = createDebug('robot-zougui:story:create-chapter:notion');

export class CreateChapterNotion extends StoryNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  createChapter = async (options: CreateChapterOptions): Promise<void> => {
    const { name, index, url, storyId, words, file } = options;

    const wordsQuery = words && {
      Words: {
        number: words,
      },
    };

    const fileQuery = file && {
      File: {
        files: [{
          name: file.name,
          external: {
            url: file.url,
          },
        }],
      },
    };

    await this.#client.pages.create({
      parent: { database_id: env.notion.databases.chapters.id },
      properties: {
        ...(wordsQuery || {}),
        ...(fileQuery || {}),
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Index: {
          number: index,
        },
        URL: { url: url ?? null },
        Story: {
          relation: [{ id: storyId }],
        },
      },
    });
  }

  createStory = async ({ name }: { name: string }): Promise<{ id: string }> => {
    const response = await this.#client.pages.create({
      parent: { database_id: env.notion.databases.stories.id },
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
      },
    });

    return {
      id: response.id,
    };
  }

  findChaptersBySimilarUrl = async (url: string): Promise<Chapter.Instance[]> => {
    debug(`find chapters by URL: "${url}"`);

    const response = await this.#client.databases.query({
      database_id: env.notion.databases.chapters.id,
      filter: {
        property: 'URL',
        url: { contains: url },
      },
    });

    return getFullPageList(response.results, Chapter);
  }
}

export interface CreateChapterOptions {
  name: string;
  index: number;
  url?: string | undefined;
  storyId: string;
  words?: number | undefined;
  file?: {
    url: string;
    name: string;
  } | undefined;
}

export interface CreateFapOptions {
  date: DateTime;
  content?: string | undefined;
}
