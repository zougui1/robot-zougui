import { Progress, DownloadState } from '@zougui/common.music-repo/lib/youtube/downloader/parser';

import { getFullProgressMessage } from './getFullProgressMessage';

export const getProgressionFinishedMessage = (options: GetProgressionFinishedMessageOptions): string => {
  const finishedState = {
    downloadingWebpage: true,
    downloadingThumbnail: true,
    writingThumbnail: true,
    fileDownloadProgress: new Progress('100%'),
    addingMetadata: true,
    addingThumbnail: true,
  };

  return getFullProgressMessage({
    fallbackName: options.fallbackName,
    isUsingFallback: options.isUsingFallback,
    mainState: options.mainState || finishedState,
    fallbackState: options.mainState ? finishedState : undefined,
  });
}

export interface GetProgressionFinishedMessageOptions {
  fallbackName: string;
  isUsingFallback: boolean;
  mainState?: DownloadState | undefined;
}
