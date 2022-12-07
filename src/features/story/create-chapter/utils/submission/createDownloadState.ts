import { DownloadState } from './types';
import { ProcessState } from '../../../../../utils';

export const createDownloadState = (): DownloadState => {
  const downloadState = new ProcessState()
    .addStep('downloadingWebpage', {
      title: 'Downloading webpage',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
    })
    .addStep('downloadingFile', {
      title: 'Downloading file',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
    })
    .addStep('parsingFile', {
      title: 'Parsing file',
      success: { content: 'Parsed' },
      running: { content: 'Parsing...' },
    })
    .addStep('countingWords', {
      title: 'Counting words',
      success: { content: 'Counted' },
      running: { content: 'Counting...' },
    });

  return downloadState;
}
