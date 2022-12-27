import { Client } from '@notionhq/client';

import env from '../../../../env';

export class SeasonNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  createSeason = async (options: CreateShowOptions): Promise<void> => {
    const { name, index, episodeCount, duration, showId } = options;

    await this.#client.pages.create({
      parent: { database_id: env.notion.databases.seasons.id },
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

        Index: {
          number: index,
        },

        Episodes: {
          number: episodeCount,
        },

        $duration: {
          number: duration,
        },

        Show: {
          relation: [{ id: showId }]
        }
      },
    });
  }
}

export interface CreateShowOptions {
  name: string;
  showId: string;
  index: number;
  episodeCount: number;
  duration: number;
}
