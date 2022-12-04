import * as _ from 'radash';

import { PlaylistRepo, Youtube, Music } from '@zougui/common.music-repo';
import { DownloadState } from '@zougui/common.music-repo/lib/youtube/downloader/parser';

import { getProgressMessage, getProgressionFinishedMessage } from './utils';
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

    downloader.parser.on('message', ({ parser }) => {
      lastState = _.clone(parser.state);
      options.onProgress(getProgressMessage(parser.state));
    });

    const [downloadError, result] = await _.try(downloader.exec)();

    if (downloadError) {
      if (lastState) {
        options.onProgress(getProgressMessage(lastState, true));
      }

      throw downloadError;
    }

    options.onProgress(getProgressionFinishedMessage());

    const originalMusic = new Music(result.destFile);
    const standardMusic = Music.tryParseUnknownPath(result.destFile);

    return {
      originalMusic,
      standardMusic,
    };
  }
}

export interface DownloadMusicOptions {
  url: string;
  playlistName: string;
  onProgress: (progress: string) => void,
}

export interface DownloadMusicResult {
  originalMusic: Music;
  standardMusic: Music | undefined;
}
