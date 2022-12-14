import path from 'node:path';

import createDebug from 'debug';
import chalk from 'chalk';
import _ from 'radash'
import axios from 'axios';
import fs from 'fs-extra';

import { countFileWords } from './countFileWords';
import { createDownloadState } from './createDownloadState';

const debug = createDebug('robot-zougui:story:create-chapter:submission:download');
const restrictedFileNameCharacters = /(\.\.)|(\/)/g;

export const downloadFile = async (url: string, tempDir: string, fileName: string, options: DownloadFileOptions): Promise<DownloadFileResult> => {
  const state = createDownloadState();
  state.on('progress', options.onProgress);
  const destFile = path.join(tempDir, fileName.replace(restrictedFileNameCharacters, '-'));

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    state.finish('downloadingFile');
    await fs.writeFile(destFile, response.data);

    const wordCount = await countFileWords(destFile, state);

    // give time for the state to emit the events before removing the listener
    process.nextTick(() => state.off('progress', options.onProgress));

    return {
      filePath: destFile,
      wordCount,
    };
  } catch (error) {
    debug(chalk.red('[ERROR]'), error);
    state.error('downloadingFile');
    return {};
  } finally {
    await fs.remove(destFile);
  }
}

export interface DownloadFileOptions {
  onProgress: (state: { progressString: string }) => void;
}

export interface DownloadFileResult {
  filePath?: string | undefined;
  wordCount?: number | undefined;
}
