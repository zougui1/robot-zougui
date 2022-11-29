import { DateTime } from 'luxon';
import { Client } from '@notionhq/client';
import createDebug from 'debug';

import { notion } from '../../../env';

const debug = createDebug('notion-trackers:fap:start:notion');

export class Notion {
  #client: Client = new Client({ auth: notion.token });

  createFap = async ({ date, content }: CreateFapOptions): Promise<void> => {
    debug(content ? `create fap with content "${content}"` : 'create fap');

    const contentUpdateObject = content && {
      Content: {
        select: {
          name: content,
        },
      },
    };

    await this.#client.pages.create({
      parent: { database_id: notion.databases.fap.id },
      properties: {
        ...(contentUpdateObject || {}),
        Name: {
          title: [
            {
              text: {
                content: 'Fap'
              }
            }
          ]
        },
        Date: {
          date: {
            start: date.toISO(),
          },
        },
        'Fapping Stats': {
          relation: [{ id: notion.stats.fapping.id }],
        },
      },
    });
  }
}

export interface CreateFapOptions {
  date: DateTime;
  content?: string | undefined;
}
