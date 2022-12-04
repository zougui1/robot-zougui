import { z } from 'zod';
import * as _ from 'radash';
import { SelectMenuBuilder, ActionRowBuilder } from 'discord.js';

import { DownloadService } from './download.service';
import { musicNamingSelectMenu } from '../music-naming';
import { Command, Option } from '../../../discord';

const reFileName = /^[a-zA-Z0-9_ -]+$/;

const playlistOption = new Option('<playlist>')
  .description('Name of the playlist in which to save the music')
  .schema(z.string().regex(reFileName, 'The playlist name cannot contain special characters'))
  .autocomplete(async ({ value }) => {
    const service = new DownloadService();
    return await service.getPlaylistNamesSuggestions({ search: value });
  });

export const subCommandDownload = new Command('download')
  .description('Download a music from a URL')
  .option('<url>', 'URL from which to download a music', {
    schema: z.string().url(),
  })
  .addOption(playlistOption)
  .action(async ({ options, reply }) => {
    const service = new DownloadService();

    const result = await service.downloadMusic({
      url: options.url,
      playlistName: options.playlist,
      onProgress: async progress => {
        await reply.sendContent(progress);
      },
    });

    const optionalOptions: { value: string; label: string }[] = [];

    reply.message.reply.content += '\n\n';
    reply.message.reply.content += `Original file name: ${result.originalMusic.fileName}`;
    reply.message.reply.content += '\n';

    if (result.standardMusic && result.originalMusic.fileName !== result.standardMusic.fileName) {
      reply.message.reply.content += `Resolved file name: ${result.standardMusic.fileName}`;
      optionalOptions.push({
        value: 'resolvedFileName',
        label: 'Resolved file name',
      });
    } else {
      reply.message.reply.content += 'Could not resolve the file name';
    }

    reply.message.reply.content += '\n';

    const { builder, onceDeletedFromCache } = musicNamingSelectMenu.create({
      playlist: options.playlist,
      fileName: result.originalMusic.fileName,
    });

    const select = builder
      .setPlaceholder('What file name do you want?')
      .setOptions([
        ...optionalOptions,
        {
          value: 'rename',
          label: 'Rename',
        },
        {
          value: 'originalFileName',
          label: 'Original file name',
        },
      ]);

    onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += '\nNo file naming strategy picked';
      await reply.reply();
    });

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(select);

    await reply.sendComponents([row]);
  });

export type { } from 'zod';
