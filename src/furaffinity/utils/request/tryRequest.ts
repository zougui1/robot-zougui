import _ from 'radash';
import createDebug from 'debug';
import chalk from 'chalk';

import { normalizeRequestError } from './normalizeRequestError';

const debug = createDebug('robot-zougui:furaffinity');

export const tryRequest = <TArgs extends unknown[], TReturn extends unknown>(
  request: (...args: TArgs) => Promise<TReturn>,
): ((...args: TArgs) => Promise<TryRequestResult<TReturn>>) => {
  const tryRequest = _.try(request);

  return async (...args: TArgs): Promise<TryRequestResult<TReturn>> => {
    const [error, result] = await tryRequest(...args);

    if (error) {
      const normalizedError = normalizeRequestError(error);
      debug(chalk.red('[ERROR]'), normalizedError);
      return [normalizedError, null];
    }

    return [null, result];
  }
}

export type TryRequestResult<T extends unknown> = (
  | [error: Error, result: null]
  | [error: null, result: T]
)
