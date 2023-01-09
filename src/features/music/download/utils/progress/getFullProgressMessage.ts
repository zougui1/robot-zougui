import { DownloadState } from '@zougui/common.music-repo/lib/youtube/downloader/parser';

import { getProgressMessage } from './getProgressMessage';
import env from '../../../../../env';

export const getFullProgressMessage = (options: GetFullProgressMessageOptions): string => {
  const {
    fallbackName,
    fallbackState,
    isUsingFallback,
    mainState,
    errored,
  } = options;

  const mainErrored = isUsingFallback
    ? true
    : errored;

  const mainProgressMessage = mainState
    ? getProgressMessage(mainState, mainErrored)
    : '';
  const fallbackMessage = isUsingFallback
    ? `${env.discord.icons.warning} falling back to ${fallbackName}`
    : '';
  const fallbackProgressMessage = fallbackState
    ? getProgressMessage(fallbackState, errored)
    : '';

  return `${mainProgressMessage}\n\n${fallbackMessage}\n\n${fallbackProgressMessage}`.trim();
}

export interface GetFullProgressMessageOptions {
  fallbackName: string;
  isUsingFallback: boolean;
  mainState?: DownloadState | undefined;
  fallbackState?: DownloadState | undefined;
  errored?: true
}
