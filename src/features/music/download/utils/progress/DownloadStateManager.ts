import { YoutubeDownloadParserStep } from '@zougui/common.music-repo';

import { createDownloadState } from './createDownloadState';
import { DownloadState } from './types';
import env from '../../../../../env';

export class DownloadStateManager {
  readonly #main: DownloadState = createDownloadState();
  #fallback: DownloadState | undefined;
  #fallbackName: string | undefined;

  finish(id: YoutubeDownloadParserStep): this {
    this.getState().finish(id);
    return this;
  }

  error(id: YoutubeDownloadParserStep): this {
    this.getState().error(id);
    return this;
  }

  warn(id: YoutubeDownloadParserStep): this {
    this.getState().warn(id);
    return this;
  }

  errorCurrent(): this {
    this.getState().errorCurrent();
    return this;
  }

  updateRunningContent(id: YoutubeDownloadParserStep, content: string): this {
    this.getState().updateRunningContent(id, content);
    return this;
  }

  getProgressString(): string {
    const mainProgressMessage = this.#main.getProgressString();
    const fallbackProgressMessage = this.#fallback?.getProgressString() || '';

    const fallbackMessage = this.#fallback
      ? `${env.discord.icons.warning} falling back to ${this.#fallbackName}`
      : '';

    return `${mainProgressMessage}\n\n${fallbackMessage}\n\n${fallbackProgressMessage}`.trim();
  }

  useFallback(name: string): this {
    if (!this.#fallback) {
      this.errorCurrent();
      this.#fallbackName = name;
      this.#fallback = createDownloadState();
    }

    return this;
  }

  private getState(): DownloadState {
    return this.#fallback || this.#main;
  }
}
