import Emittery from 'emittery';

export class DownloadSubmissionState extends Emittery<DownloadSubmissionStateEventMap> {
  downloadingWebpage: boolean = false;
  downloadingFile: boolean = false;
  parsingFile: boolean = false;
  countingWords: boolean = false;
  errored: boolean = false;

  finishDownloadingWebpage = (): void => {
    this.downloadingWebpage = true;
    this.update();
  }

  finishDownloadingFile = (): void => {
    this.downloadingFile = true;
    this.update();
  }

  finishParsingFile = (): void => {
    this.parsingFile = true;
    this.update();
  }

  finishCountingWords = (): void => {
    this.countingWords = true;
    this.update();
  }

  error = (): void => {
    this.errored = true;
    this.update();
  }

  private update(): void {
    this.emit('progress', this);
  }
}

export interface DownloadSubmissionStateEventMap {
  progress: DownloadSubmissionState;
}
