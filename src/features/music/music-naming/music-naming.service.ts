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

  async transformFileName(options: MusicOptions): Promise<void> {
    const filePath = await this.getFilePath(options);
    const music = new Music(filePath);
    const maybeNewMusic = await music.tryRenameFromUnknownPath();

    if (!maybeNewMusic) {
      throw new Error(`Could not resolve the file name "${filePath}"`);
    }

    const playlist = await this.getPlaylist(options.playlist);
    await playlist.addMusic(maybeNewMusic);
  }

  private async getPlaylist(name: string): Promise<Playlist> {
    const playlist = await this.#repo.getPlaylist(name);

    if (!playlist) {
      throw new Error(`The playlist "${name}" does not exist`);
    }

    return playlist;
  }

  private async getFilePath(options: MusicOptions): Promise<string> {
    const filePath = path.join(env.music.tempDir, options.fileName);
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
