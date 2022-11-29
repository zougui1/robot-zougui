import _ from 'radash';
import { DateTime } from 'luxon';
import createDebug from 'debug';

import { Notion } from './start.notion';

const debug = createDebug('notion-trackers:fap:start:service');

export class Service {
  #notion: Notion = new Notion();

  createFap = async (options: { content?: string | undefined }): Promise<void> => {
    const date = DateTime.now();
    const [error] = await _.try(this.#notion.createFap)({
      ...options,
      date,
    });

    if (error) {
      throw new Error('An error occured while trying to save the entry', { cause: error });
    }

    debug('fap created');
  }
}
