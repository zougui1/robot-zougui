import { ProcessState } from '../../../../../utils';

export type DownloadStateSteps = (
  | 'downloadingWebpage'
  | 'downloadingFile'
  | 'parsingFile'
  | 'countingWords'
)

export type DownloadState = ProcessState<DownloadStateSteps>;
