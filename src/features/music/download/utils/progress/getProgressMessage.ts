import { PartialDeep } from 'type-fest';

import { DownloadState } from '@zougui/common.music-repo/lib/youtube/downloader/parser';

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

  downloadingThumbnail: {
    title: 'Downloading thumbnail',
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

  writingThumbnail: {
    title: 'Writing thumbnail',
    success: {
      icon: env.discord.icons.success,
      content: 'Written',
    },
    running: {
      icon: env.discord.icons.running,
      content: 'Writing...',
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
    },
    error: errorMessage,
  },

  addingMetadata: {
    title: 'Adding metadata',
    success: {
      icon: env.discord.icons.success,
      content: 'Added',
    },
    running: {
      icon: env.discord.icons.running,
      content: 'Adding...',
    },
    error: errorMessage,
  },

  addingThumbnail: {
    title: 'Adding thumbnail',
    success: {
      icon: env.discord.icons.success,
      content: 'Added',
    },
    running: {
      icon: env.discord.icons.running,
      content: 'Adding...',
    },
    error: errorMessage,
  },
} satisfies Record<string, PartialDeep<StaticStepOptions>>;

export const getProgressMessage = (state: DownloadState, errored?: true): string => {
  const {
    downloadingWebpage,
    downloadingThumbnail,
    writingThumbnail,
    fileDownloadProgress,
    addingMetadata,
    addingThumbnail,
  } = state;

  const progress = new ProcessProgress()
    .addStep({
      ...staticSteps.downloadingWebpage,
      done: downloadingWebpage,
      errored: Boolean(errored),
    })
    .addStep({
      ...staticSteps.downloadingThumbnail,
      done: downloadingThumbnail,
      errored: Boolean(errored),
    })
    .addStep({
      ...staticSteps.writingThumbnail,
      done: writingThumbnail,
      errored: Boolean(errored),
    })
    .addStep({
      ...staticSteps.downloadingFile,
      running: {
        ...staticSteps.downloadingFile.running,
        content: fileDownloadProgress?.toString() || '',
      },
      done: Boolean(fileDownloadProgress?.isDone()),
      errored: Boolean(errored),
    })
    .addStep({
      ...staticSteps.addingMetadata,
      done: addingMetadata,
      errored: Boolean(errored),
    })
    .addStep({
      ...staticSteps.addingThumbnail,
      done: addingThumbnail,
      errored: Boolean(errored),
    })

  return progress.toString();
}

type StaticStepOptions = {
  title: string;
  success: StepMessage;
  running: StepMessage;
  error: StepMessage;
}
