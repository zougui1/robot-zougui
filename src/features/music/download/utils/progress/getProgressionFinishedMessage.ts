import { Progress } from '@zougui/common.music-repo/lib/youtube/downloader/parser';

import { getProgressMessage } from './getProgressMessage';

export const getProgressionFinishedMessage = (): string => {
  return getProgressMessage({
    downloadingWebpage: true,
    downloadingThumbnail: true,
    writingThumbnail: true,
    fileDownloadProgress: new Progress('100%'),
    addingMetadata: true,
    addingThumbnail: true,
  });
}
