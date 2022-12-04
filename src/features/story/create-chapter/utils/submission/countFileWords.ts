import createDebug from 'debug';
import chalk from 'chalk';
import { getText } from 'any-text';
import _ from 'radash';

import { DownloadSubmissionState } from './DownloadSubmissionState';
import { splitWords } from '../../../../../utils';

const debug = createDebug('robot-zougui:story:create-chapter:submission:count-words');

export const countFileWords = async (filePath: string, state: DownloadSubmissionState): Promise<number | undefined> => {
  const [error, text] = await _.try(getText)(filePath);

  if (error) {
    debug(chalk.red('[ERROR]'), error);
    return;
  }

  state.finishParsingFile();

  const words = splitWords(text);
  state.finishCountingWords();

  return words.length
}
