import _ from 'radash';
import { DateTime } from 'luxon';
import createDebug from 'debug';

import { StartNotion } from './start.notion';

const debug = createDebug('robot-zougui:fap:start:service');

export class StartService {
  readonly #notion: StartNotion = new StartNotion();

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
