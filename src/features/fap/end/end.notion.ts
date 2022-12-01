import { DateTime } from 'luxon';
import { Client } from '@notionhq/client';
import { QueryDatabaseResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import createDebug from 'debug';

import { Fap } from '../fap.model';
import { getFullPageList } from '../../../notion';
import env from '../../../env';

const debug = createDebug('robot-zougui:fap:end:notion');

export class EndNotion {
  readonly #client: Client = new Client({ auth: env.notion.token });

  getFaps = async (): Promise<Fap.Instance[]> => {
    debug('get faps');

    const response = await this.#client.databases.query({
      database_id: env.notion.databases.fap.id,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return getFullPageList(response.results, Fap);
  }

  finishFap = async ({ id, startDate, endDate, content }: FinishFapOptions): Promise<void> => {
    debug(content ? `finish fap with content "${content}"` : 'finish fap');

    const contentUpdateObject = content && {
      Content: {
        select: {
          name: content,
        },
      },
    };

    await this.#client.pages.update({
      page_id: id,
      properties: {
        ...(contentUpdateObject || {}),
        Date: {
          date: {
            start: startDate.toISO(),
            end: endDate.toISO(),
          },
        },
      }
    });
  }
}

export interface FinishFapOptions {
  id: string;
  startDate: DateTime;
  endDate: DateTime;
  content?: string | undefined;
}

export type { QueryDatabaseResponse, PageObjectResponse };
