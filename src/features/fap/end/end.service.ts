import _ from 'radash';
import { DateTime } from 'luxon';
import createDebug from 'debug';

import { ms } from '@zougui/common.ms';

import { findUnfinishedFap } from './utils';
import { EndNotion } from './end.notion';
import { Fap } from '../fap.model';

const debug = createDebug('robot-zougui:fap:end:service');

export class EndService {
  readonly #notion: EndNotion = new EndNotion();

  finishLastFap = async (options: FinishLastFapOptions): Promise<FinishLastFapResult> => {
    const unfinishedFap = await this.getUnfinishedFap();
    await this.finishFap(unfinishedFap, {
      ...options,
      endDate: options.date,
    });

    const startTimestamp = unfinishedFap.properties.Date.start.toMillis();
    const endTimestamp = options.date.toMillis();

    return {
      duration: ms(endTimestamp - startTimestamp, { format: 'verbose' }),
    };
  }

  //#region
  private getUnfinishedFap = async (): Promise<Fap.Instance> => {
    const [error, faps] = await _.try(this.#notion.getFaps)();

    if (error) {
      throw new Error('An error occured while trying to retrieve unfinished fap data', { cause: error });
    }

    const unfinishedFap = findUnfinishedFap(faps);

    if (!unfinishedFap) {
      throw new Error('No unfinished fap found');
    }

    return unfinishedFap;
  }

  private finishFap = async (fap: Fap.Instance, options: FinishFapOptions): Promise<void> => {
    const [error] = await _.try(this.#notion.finishFap)({
      id: fap.id,
      startDate: fap.properties.Date.start,
      endDate: options.endDate,
      content: options.content,
    });

    if (error) {
      throw new Error('An error occured while trying to update the fap entry', { cause: error });
    }

    debug('fap finished');
  }
  //#endregion
}

export interface FinishLastFapOptions {
  content?: string | undefined;
  date: DateTime;
}

export interface FinishLastFapResult {
  duration: string;
}

export interface FinishFapOptions {
  content?: string | undefined;
  endDate: DateTime;
}
