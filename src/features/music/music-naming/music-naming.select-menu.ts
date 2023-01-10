import { TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import createDebug from 'debug';
import chalk from 'chalk';

import { MusicNamingService } from './music-naming.service';
import { renamingModal } from './renaming.modal';
import { SelectMenu } from '../../../discord';

const debug = createDebug('robot-zougui:music:music-renaming:menu');

export const musicNamingSelectMenu = new SelectMenu('music-naming')
  .option('playlist', 'p')
  .option('fileName', 'f')
  .action(async ({ options, interaction, reply }) => {
    const service = new MusicNamingService();
    const [value] = interaction.values;

    reply.originalComponents = [];

    switch (value) {
      case MusicNamingOption.originalFileName:
        await reply.fetchOriginalReply();
        await service.moveToPlaylist(options);
        reply.originalMessage.reply.content += '\nKept original file name';
        await reply.editOriginalReply();
        await reply.respondSuccess(`The file has been added to the playlist "${options.playlist}"`);
        break;

      case MusicNamingOption.resolvedFileName:
        await reply.fetchOriginalReply();
        await service.transformFileName(options);
        reply.originalMessage.reply.content += '\nRenamed file to resolved name';
        await reply.editOriginalReply();
        await reply.respondSuccess(`The file has been renamed and added to the playlist "${options.playlist}"`);
        break;

      case MusicNamingOption.rename: {
        const file = await service.resolveFileName(options);
        const { builder, onceDeletedFromCache } = renamingModal.create({
          ...options,
          trackNumber: String(file.trackNumber),
        });

        const modal = builder.setTitle('Renaming music');

        const originalFileNameInput = new TextInputBuilder()
          .setCustomId('originalFileName')
          .setLabel('Original file name')
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setValue(options.fileName);

        const titleInput = new TextInputBuilder()
          .setCustomId('title')
          .setLabel('Title')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setValue(file.title);

        const artistsInput = new TextInputBuilder()
          .setCustomId('artists')
          .setLabel('Artists (separated by a comma)')
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setValue(file.artists.join(', '));

        const inputs = [
          originalFileNameInput,
          titleInput,
          artistsInput,
        ];
        const rows = inputs.map(input => {
          return new ActionRowBuilder<TextInputBuilder>().addComponents(input);
        });
        modal.addComponents(...rows);

        onceDeletedFromCache?.(async () => {
          reply.removeComponents();
          reply.message.reply.content += '\nCan no longer rename the file';
          await reply.reply();
        });

        reply.originalMessage.reply.content += '\nManual file renaming';
        await interaction.showModal(modal);
        break;
      }

      default:
        throw new Error(`Music naming option "${value}" does not exist`);
    }
  });

export enum MusicNamingOption {
  originalFileName = 'originalFileName',
  resolvedFileName = 'resolvedFileName',
  rename = 'rename',
}
