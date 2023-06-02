import { TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

import { newExerciseModal } from './new.modal';
import { Button } from '../../../../discord';

export const newButton = new Button('new-exercise')
  .action(async ({ reply, interaction }) => {
    const { builder, onceDeletedFromCache } = newExerciseModal.create({});

    const modal = builder.setTitle('New exercise');

    const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Name')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);

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

    const targetedMuscleRegionInput = new TextInputBuilder()
      .setCustomId('targeted-muscle-regions')
      .setLabel('Targeted muscle regions')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const secondRow = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(weightInput);
    const thirdRow = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(repsInput);
    const fourthRow = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(targetedMuscleRegionInput);

    modal.addComponents(row, secondRow, thirdRow, fourthRow as any);

    onceDeletedFromCache?.(async () => {
      reply.removeComponents();
      reply.message.reply.content += '\nCan no longer add new exercises';
      await reply.reply();
    });

    await interaction.showModal(modal);
  });
