import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

import { CreateSeasonService } from './create-season.service';
import { nameOption, sourceOption } from './options';
import { newButton } from './new';
import { Command } from '../../../discord';

export const subCommandCreateSeason = new Command('create-season')
  .description('Create new seasons for a show')
  .addOption(nameOption)
  .addOption(sourceOption)
  .action(async ({ options, reply }) => {
    reply.defer();

    const service = new CreateSeasonService();
    await service.ensureUniqueShow(options);

    const { builder, onceDeletedFromCache } = newButton.create({
      showName: options.name,
    });

    const button = builder
      .setLabel('New season')
      .setStyle(ButtonStyle.Primary);

    onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += '\nNo new seasons created';
      await reply.reply();
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    reply.components = [row];
    await reply.sendContent(options.name);
  });
