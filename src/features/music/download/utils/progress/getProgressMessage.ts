import { Progress, DownloadState } from '@zougui/common.music-repo/lib/youtube/downloader/parser';

import { compact } from '../../../../../utils';

const icons = {
  success: '✅',
  error: '❌',
  running: '<a:loading:1046427341120880690>',
}

const labels = {
  downloadingWebpage: {
    title: 'Downloading webpage',
    success: 'Downloaded',
    running: 'Downloading',
  },

  downloadingThumbnail: {
    title: 'Downloading thumbnail',
    success: 'Downloaded',
    running: 'Downloading',
  },

  writingThumbnail: {
    title: 'Writing thumbnail',
    success: 'Written',
    running: 'Writing',
  },

  downloadingFile: {
    title: 'Downloading file',
    success: 'Downloaded',
    running: 'Downloading',
  },

  addingMetadata: {
    title: 'Adding metadata',
    success: 'Added',
    running: 'Adding',
  },

  addingThumbnail: {
    title: 'Adding thumbnail',
    success: 'Added',
    running: 'Adding',
  },
} satisfies Record<string, Label>;

export const getProgressMessage = (state: DownloadState, errored?: true): string => {
  const {
    downloadingWebpage,
    downloadingThumbnail,
    writingThumbnail,
    fileDownloadProgress,
    addingMetadata,
    addingThumbnail,
  } = state;

  const lines = compact([
    getMessage(true, downloadingWebpage, labels.downloadingWebpage, errored),
    getMessage(downloadingWebpage, downloadingThumbnail, labels.downloadingThumbnail, errored),
    getMessage(downloadingThumbnail, writingThumbnail, labels.writingThumbnail, errored),
    getProgress(fileDownloadProgress, labels.downloadingFile, errored),
    getMessage(!!fileDownloadProgress?.isDone(), addingMetadata, labels.addingMetadata, errored),
    getMessage(addingMetadata, addingThumbnail, labels.addingThumbnail, errored),
  ]);

  return lines.join('\n');
}

const getMessage = (previousStepDone: boolean, done: boolean, label: Label, errored: boolean | undefined): string | undefined => {
  if (!previousStepDone) {
    return;
  }

  const messages = {
    success: `${icons.success} ${label.success}`,
    running: `${icons.running} ${label.running}...`,
    error: `${icons.error} An error occured`,
  };
  const message = getStatusMessage(messages, done, errored);

  return `${label.title}: ${message}`;
}

interface Label {
  title: string;
  success: string;
  running: string;
}

const getProgress = (progress: Progress | undefined, label: Omit<Label, 'running'>, errored: boolean | undefined): string | undefined => {
  if (!progress) {
    return;
  }

  const messages = {
    success: `${icons.success} ${label.success}`,
    running: progress.toString(),
    error: `${icons.error} An error occured`,
  };
  const message = getStatusMessage(messages, progress.isDone(), errored);

  return `${label.title}: ${message}`;
}

const getStatusMessage = (label: StatusLabels, done: boolean, errored: boolean | undefined): string => {
  if (done) {
    return label.success;
  }

  if (errored) {
    return label.error;
  }

  return label.running;
}

interface StatusLabels {
  success: string;
  error: string;
  running: string;
}
