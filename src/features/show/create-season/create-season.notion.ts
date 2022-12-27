import { Client } from '@notionhq/client';

import { Show } from '../show.model';
import { ShowSource } from '../enums';
import env from '../../../env';
import { getFullPageList } from '../../../notion';

export class CreateSeasonNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  findShowsByName = async (name: string): Promise<Show.Instance[]> => {
    const result = await this.#client.databases.query({
      database_id: env.notion.databases.shows.id,
      filter: {
        property: 'Name',
        title: {
          equals: name,
        },
      },
    });

    return getFullPageList(result.results, Show);
  }

  createShow = async ({ name, source }: CreateShowOptions): Promise<Show.Instance> => {
    const sourceCreationObject = source && {
      Source: {
        select: {
          name: source,
        },
      },
    };

    const response = await this.#client.pages.create({
      parent: { database_id: env.notion.databases.shows.id },
      properties: {
        ...(sourceCreationObject || {}),
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

    const [show] = getFullPageList([response], Show);

    return show;
  }

  findMatchingShows = async ({ name }: { name: string }): Promise<Show.Instance[]> => {
    const result = await this.#client.databases.query({
      database_id: env.notion.databases.shows.id,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
      filter: {
        property: 'Name',
        title: {
          contains: name,
        },
      },
    });

    return getFullPageList(result.results, Show);
  }
}

export interface CreateShowOptions {
  name: string;
  source?: ShowSource | undefined;
}
