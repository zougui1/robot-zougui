import { DownloadState } from './types';
import { ProcessState } from '../../../../../utils';

export const createDownloadState = (): DownloadState => {
  const downloadState = new ProcessState()
    .addStep('downloadingWebpage', {
      title: 'Downloading webpage',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
    })
    .addStep('downloadingThumbnail', {
      title: 'Downloading thumbnail',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
    })
    .addStep('writingThumbnail', {
      title: 'Writing thumbnail',
      success: { content: 'Written' },
      running: { content: 'Writing...' },
    })
    .addStep('downloadingFile', {
      title: 'Downloading file',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
    })
    .addStep('addingMetadata', {
      title: 'Adding metadata',
      success: { content: 'Added' },
      running: { content: 'Adding...' },
    })
    .addStep('addingThumbnail', {
      title: 'Adding thumbnail',
      success: { content: 'Added' },
      running: { content: 'Adding...' },
    });

  return downloadState;
}
