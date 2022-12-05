import createDebug from 'debug';
import chalk from 'chalk';
import _ from 'radash'

import { findStorySubmission } from './findStorySubmission';
import { countFileWords } from './countFileWords';
import { DownloadSubmissionState } from './DownloadSubmissionState';
import { Submission } from '../../../../../furaffinity';

const debug = createDebug('robot-zougui:story:create-chapter:submission:download');

export const downloadSubmission = async (url: string, tempDir: string, options: DownloadSubmissionOptions): Promise<DownloadSubmissionResult> => {
  const state = new DownloadSubmissionState();
  state.on('progress', options.onProgress);

  const [submissionError, submission] = await _.try(findStorySubmission)(url);

  if (submissionError) {
    state.error();
    throw submissionError;
  } else {
    state.finishDownloadingWebpage();
  }

  const [fileError, file] = await _.try(submission.file.downloadToDir)(tempDir);

  if (fileError) {
    debug(chalk.red('[ERROR]'), fileError);
  } else {
    state.finishDownloadingFile();
  }

  const isFileStory = submission.file.isStory();

  if (!isFileStory) {
    state.error();
  }

  const wordCount = (file?.destFile && isFileStory) ? await countFileWords(file.destFile, state) : undefined;

  return {
    data: submission,
    filePath: file?.destFile,
    wordCount,
    state,
  };
}

export interface DownloadSubmissionOptions {
  onProgress: (state: DownloadSubmissionState) => void;
}

export interface DownloadSubmissionResult {
  data: Submission;
  state: DownloadSubmissionState;
  filePath?: string | undefined;
  wordCount?: number | undefined;
}
