import { TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

import { NewService } from './new.service';
import { seasonModal } from '../season';
import { Button } from '../../../../discord';

export const newButton = new Button('new-season')
  .option('showName', 's')
  .action(async ({ options, reply, interaction }) => {
    const { showName } = options;
    const service = new NewService();
    const seasonIndex = await service.findNewSeasonIndex({ name: showName });

    const { builder, onceDeletedFromCache } = seasonModal.create({
      showName,
      seasonIndex: String(seasonIndex),
    });

    const modal = builder.setTitle(`${options.showName} season ${seasonIndex}`);

    const episodesInput = new TextInputBuilder()
      .setCustomId('episodes')
      .setLabel('Episodes duration (in minutes)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(episodesInput);
    modal.addComponents(row);

    onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += `\nCan no longer create new seasons for the show "${showName}"`;
      await reply.reply();
    });

    await interaction.showModal(modal);
  });
