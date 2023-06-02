import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } from 'discord.js';

import { endButton } from './end';
import { newButton } from './new';
import { Command } from '../../../discord';

export const subCommandStart = new Command('start')
  .description('start exercising')
  /*.action(async ({ reply }) => {
    reply.defer();


    const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Name')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const repsInput = new TextInputBuilder()
      .setCustomId('reps')
      .setLabel('Reps')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const weightInput = new TextInputBuilder()
      .setCustomId('weight')
      .setLabel('Weight')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const targetedMuscleRegion = new StringSelectMenuBuilder()
      .setCustomId('targeted-muscle-regions')
      .setPlaceholder('Targeted muscle regions')
      .setMinValues(1)
      //.setMaxValues(4)
      .setOptions([
        { label: 'Right arm', value: 'Right arm' },
        { label: 'Left arm', value: 'Left arm' },
        { label: 'Right leg', value: 'Right leg' },
        { label: 'Left leg', value: 'Left leg' },
      ]);

    const newButt = newButton.create({});
    const buttonNew = newButt.builder.setLabel('New').setStyle(ButtonStyle.Primary);

    newButt.onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += '\nCan no longer add new exercises';
      await reply.reply();
    });

    const end = endButton.create({});
    const buttonEnd = end.builder.setLabel('Finish').setStyle(ButtonStyle.Primary);

    end.onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += '\nCan no longer finished exercises';
      await reply.reply();
    });

    const row = new ActionRowBuilder<ButtonBuilder | TextInputBuilder | StringSelectMenuBuilder>()
      .addComponents(
        nameInput,
        weightInput,
        repsInput,
        targetedMuscleRegion,
        buttonNew,
      );
    const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonEnd);

    reply.components = [
      new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput) as any,
      new ActionRowBuilder<TextInputBuilder>().addComponents(weightInput) as any,
      new ActionRowBuilder<TextInputBuilder>().addComponents(repsInput) as any,
      new ActionRowBuilder<StringSelectMenuBuilder | ButtonBuilder>().addComponents(targetedMuscleRegion) as any,
      //new ActionRowBuilder<ButtonBuilder>().addComponents(buttonNew) as any,
      secondRow,
    ];
    await reply.sendContent('Started at XXX');
  });*/
  .action(async ({ reply }) => {
    reply.defer();

    const newButt = newButton.create({});
    const buttonNew = newButt.builder.setLabel('New').setStyle(ButtonStyle.Primary);

    newButt.onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += '\nCan no longer add new exercises';
      await reply.reply();
    });

    const end = endButton.create({});
    const buttonEnd = end.builder.setLabel('Finish').setStyle(ButtonStyle.Primary);

    end.onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += '\nCan no longer finished exercises';
      await reply.reply();
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonNew);
    const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonEnd);

    reply.components = [row, secondRow];
    await reply.sendContent('Started at XXX');
  });

export type { } from 'zod';
