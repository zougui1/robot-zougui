import path from 'node:path';

import fs from 'fs-extra';

import { PlaylistRepo, Playlist, Music } from '@zougui/common.music-repo';

import env from '../../../env';

export class MusicNamingService {
  readonly #repo: PlaylistRepo = new PlaylistRepo(env.music.dir);

  async moveToPlaylist(options: MusicOptions): Promise<void> {
    const filePath = await this.getFilePath(options);
    const playlist = await this.getPlaylist(options.playlist);
    await playlist.addMusic(filePath);
  }

  async transformFileName(options: MusicOptions): Promise<{ fileName: string }> {
    const filePath = await this.getFilePath(options);
    const music = new Music(filePath);
    const maybeNewMusic = await music.tryRenameFromUnknownPath();

    if (!maybeNewMusic) {
      throw new Error(`Could not resolve the file name "${filePath}"`);
    }

    const playlist = await this.getPlaylist(options.playlist);
    await playlist.addMusic(maybeNewMusic);

    return {
      fileName: maybeNewMusic.fileName,
    };
  }

  async renameFile(options: RenameFileOptions): Promise<{ fileName: string }> {
    const filePath = await this.getFilePath(options);
    const music = new Music(filePath);
    const newMusic = await music.rename(options);

    const playlist = await this.getPlaylist(options.playlist);
    await playlist.addMusic(newMusic);

    return {
      fileName: newMusic.fileName,
    };
  }

  async resolveFileName(options: MusicOptions): Promise<ResolvedFileName> {
    const filePath = await this.getFilePath(options);
    const maybeMusic = Music.tryParseUnknownPath(filePath);

    if (!maybeMusic) {
      const music = new Music(filePath);

      return {
        trackNumber: music.trackNumber,
        title: music.title,
        // copy of the array because it is readonly
        artists: [...music.artists],
      };
    }

    return {
      trackNumber: maybeMusic.trackNumber,
      title: maybeMusic.title,
      // copy of the array because it is readonly
      artists: [...maybeMusic.artists],
    };
  }

  private async getPlaylist(name: string): Promise<Playlist> {
    const playlist = await this.#repo.getPlaylist(name);

    if (!playlist) {
      throw new Error(`The playlist "${name}" does not exist`);
    }

    return playlist;
  }

  private async getFilePath(options: MusicOptions): Promise<string> {
    const filePath = path.join(env.tempDir, options.fileName);
    const doesFileExist = await fs.pathExists(filePath);

    if (!doesFileExist) {
      throw new Error(`The file no longer exists. It may have been renamed, moved or removed`);
    }

    return filePath;
  }
}

export interface MusicOptions {
  playlist: string;
  fileName: string;
}

export interface RenameFileOptions {
  trackNumber: number;
  title: string;
  artists: string[];
  playlist: string;
  fileName: string;
}

export interface ResolvedFileName {
  trackNumber: number;
  title: string;
  artists: string[];
}
