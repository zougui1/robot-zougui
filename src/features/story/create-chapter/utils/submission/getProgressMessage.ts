import { ProcessProgress, StepMessage } from '../../../../../utils';
import env from '../../../../../env';

const errorMessage: StepMessage = {
  icon: env.discord.icons.error,
  content: 'An error occured',
};

const staticSteps = {
  downloadingWebpage: {
    title: 'Downloading webpage',
    success: {
      icon: env.discord.icons.success,
      content: 'Downloaded',
    },
    running: {
      icon: env.discord.icons.running,
      content: 'Downloading...',
    },
    error: errorMessage,
  },

  downloadingFile: {
    title: 'Downloading file',
    success: {
      icon: env.discord.icons.success,
      content: 'Downloaded',
    },
    running: {
      icon: env.discord.icons.running,
      content: 'Downloading...',
    },
    error: errorMessage,
  },

  parsingFile: {
    title: 'Parsing file',
    success: {
      icon: env.discord.icons.success,
      content: 'Parsed',
    },
    running: {
      icon: env.discord.icons.running,
      content: 'Parsing...',
    },
    error: errorMessage,
  },

  countingWords: {
    title: 'Counting words',
    success: {
      icon: env.discord.icons.success,
      content: 'Counted',
    },
    running: {
      icon: env.discord.icons.running,
      content: 'Counting...',
    },
    error: errorMessage,
  },
} satisfies Record<string, StaticStepOptions>;

export const getProgressMessage = (state: DownloadState): string => {
  const {
    downloadingWebpage,
    downloadingFile,
    parsingFile,
    countingWords,
  } = state;

  const progress = new ProcessProgress()
    .addStep({
      ...staticSteps.downloadingWebpage,
      done: downloadingWebpage,
      errored: Boolean(state.errored),
    })
    .addStep({
      ...staticSteps.downloadingFile,
      done: downloadingFile,
      errored: Boolean(state.errored),
    })
    .addStep({
      ...staticSteps.parsingFile,
      done: parsingFile,
      errored: Boolean(state.errored),
    })
    .addStep({
      ...staticSteps.countingWords,
      done: countingWords,
      errored: Boolean(state.errored),
    });

  return progress.toString();
}

export interface DownloadState  {
  downloadingWebpage: boolean;
  downloadingFile: boolean;
  parsingFile: boolean;
  countingWords: boolean;
  errored: boolean;
}

type StaticStepOptions = {
  title: string;
  success: StepMessage;
  running: StepMessage;
  error: StepMessage;
}
