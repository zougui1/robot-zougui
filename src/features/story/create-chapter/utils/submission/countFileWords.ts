import createDebug from 'debug';
import chalk from 'chalk';
import _ from 'radash';

import { DownloadState } from './types';
import { splitWords, readText } from '../../../../../utils';

const debug = createDebug('robot-zougui:story:create-chapter:submission:count-words');

export const countFileWords = async (filePath: string, state: DownloadState, options?: CountFileWordsOptions | undefined): Promise<number | undefined> => {
  const [error, text] = await _.try(readText)(filePath);

  if (error) {
    debug(chalk.red('[ERROR]'), error);
    state.error('parsingFile');
    return;
  }

  if (options?.parseWarning) {
    state.warn('parsingFile', options.parseWarning);
  } else {
    state.finish('parsingFile');
  }

  const words = splitWords(text);
  state.finish('countingWords');

  return words.length
}

export interface CountFileWordsOptions {
  parseWarning?: string | undefined;
}
