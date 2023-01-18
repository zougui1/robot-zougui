import * as _ from 'radash';

import { PlaylistRepo, Youtube, Music } from '@zougui/common.music-repo';
import { DownloadState } from '@zougui/common.music-repo/lib/youtube/downloader/parser';

import { DownloadStateManager } from './utils/progress/DownloadStateManager';
import { Exception } from '../../../error';
import env from '../../../env';

export class DownloadService {
  static readonly errorCodes = {
    noPlaylist: 'ERR_NO_PLAYLIST',
  } as const;

  readonly #repo: PlaylistRepo = new PlaylistRepo(env.music.dir);

  async getPlaylistNamesSuggestions(options: { search: string }): Promise<string[]> {
    const search = options.search.toLowerCase();
    const playlistNames = await this.#repo.getNameList();

    if (!search.trim()) {
      return playlistNames;
    }

    return playlistNames.filter(playlistName => {
      return playlistName.toLowerCase().includes(search);
    });
  }

  async downloadMusic(options: DownloadMusicOptions): Promise<DownloadMusicResult> {
    const { playlistName, url } = options;
    const progressPromises: (Promise<void> | void)[] = [];

    const playlist = await this.#repo.getPlaylist(playlistName);
    const playlistExists = await playlist?.getExists();

    if (!playlist || !playlistExists) {
      const message = `The playlist "${playlistName}" does not exist.`;
      const code = DownloadService.errorCodes.noPlaylist;

      throw new Exception(message, { code });
    }

    const lastTrackNumber = await playlist.getLastTrackNumber();
    const newTrackNumber = lastTrackNumber + 1;

    const downloader = Youtube.downloadAudio(url, {
      trackNumber: Music.stringifyTrackNumber(newTrackNumber),
      outputDir: env.tempDir,
    });

    let lastState: DownloadState | undefined;
    let lastFallbackState: DownloadState | undefined;

    const stateManager = new DownloadStateManager();

    const handleProgress = (progress: string): void => {
      progressPromises.push(options.onProgress(progress));
    }

    downloader.on('fallback', ({ command }) => {
      stateManager.useFallback(command);
    });

    const update = () => {
      if (downloader.isUsingFallback) {
        lastFallbackState = _.clone(downloader.parser.state);
      } else {
        lastState = _.clone(downloader.parser.state);
      }

      handleProgress(stateManager.getProgressString());
    }

    downloader.parser.on('end-step', ({ name }) => {
      stateManager.finish(name);
      update();
    });

    downloader.parser.on('progress-step', ({ name, progress }) => {
      if (name === 'downloadingFile' && progress) {
        stateManager.updateRunningContent(name, progress.toString());
      }

      update();
    });

    const [downloadError, result] = await _.try(downloader.exec)();

    if (downloadError) {
      const actualLastState = lastFallbackState || lastState;

      if (actualLastState) {
        stateManager.errorCurrent();
        handleProgress(stateManager.getProgressString());
      }

      throw downloadError;
    }

    const originalMusic = new Music(result.destFile);
    const standardMusic = Music.tryParseUnknownPath(result.destFile);

    await Promise.all(progressPromises);

    return {
      originalMusic,
      standardMusic,
    };
  }
}

export interface DownloadMusicOptions {
  url: string;
  playlistName: string;
  onProgress: (progress: string) => void | Promise<void>,
}

export interface DownloadMusicResult {
  originalMusic: Music;
  standardMusic: Music | undefined;
}
