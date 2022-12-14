import { ProcessState } from '../../../../../utils';

export type DownloadStateSteps = (
  | 'downloadingFile'
  | 'parsingFile'
  | 'countingWords'
)

export type DownloadState = ProcessState<DownloadStateSteps>;
