import createDebug from 'debug';
import chalk from 'chalk';
import _ from 'radash'

import { findStorySubmission } from './findStorySubmission';
import { countFileWords } from './countFileWords';
import { createDownloadState } from './createDownloadState';
import { Submission } from '../../../../../external-source';

const debug = createDebug('robot-zougui:story:create-chapter:submission:download');

export const downloadSubmission = async (url: string, tempDir: string, options: DownloadSubmissionOptions): Promise<DownloadSubmissionResult> => {
  const state = createDownloadState();
  state.on('progress', options.onProgress);

  const [submissionError, submission] = await _.try(findStorySubmission)(url);

  if (submissionError) {
    state.error('downloadingWebpage');
    throw submissionError;
  } else {
    state.finish('downloadingWebpage');
  }

  const [fileError, file] = await _.try(submission.file.downloadToDir)(tempDir);

  if (fileError) {
    debug(chalk.red('[ERROR]'), fileError);
    state.error('downloadingFile');
  } else {
    state.finish('downloadingFile');
  }

  const isFileStory = submission.file.isStory();

  if (!isFileStory) {
    state.error('parsingFile', `The submission file is not a text or a document. The file extension is ${submission.file.extension}`);
  }

  console.log('submission.file.isEmptyExtension', submission.file.isEmptyExtension())
  const parseWarning = submission.file.isEmptyExtension()
    ? `No file extension found. Extension inferred as ${submission.file.extension}`
    : undefined;

  const wordCount = (file?.destFile && isFileStory)
    ? await countFileWords(file.destFile, state,  { parseWarning })
    : undefined;

  // give time for the state to emit the events before removing the listener
  process.nextTick(() => state.off('progress', options.onProgress));

  return {
    data: submission,
    filePath: file?.destFile,
    wordCount,
  };
}

export interface DownloadSubmissionOptions {
  onProgress: (state: { progressString: string }) => void;
}

export interface DownloadSubmissionResult {
  data: Submission;
  filePath?: string | undefined;
  wordCount?: number | undefined;
}
