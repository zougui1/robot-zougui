import createDebug from 'debug';

//import { SeasonService } from './season.service';
import { Modal } from '../../../../discord';
import { getErrorMessage } from '../../../../utils';

//const debug = createDebug('robot-zougui:show:create-season:season:modal');

export const newExerciseModal = new Modal('new-exercise-modal')
  //.option('showName', 's')
  //.option('seasonIndex', 'i')
  .action(async ({ options, reply, interaction }) => {
    const name = interaction.fields.getTextInputValue('name');
    const reps = interaction.fields.getTextInputValue('reps');
    const weight = interaction.fields.getTextInputValue('weight');

    await reply.fetchOriginalReply();
    reply.originalMessage.reply.content += `\n- ${name} (${weight} kg): ${reps}`;
    await reply.editOriginalReply();
    /*const service = new SeasonService();

    await reply.fetchOriginalReply();

    const label = `\nSeason ${options.seasonIndex}:`;

    try {
      await service.createSeason({
        name: options.showName,
        index: Number(options.seasonIndex),
        episodesDurations: interaction.fields.getTextInputValue('episodes'),
      });

      reply.originalMessage.reply.content += `${label} ✅ created`;
    } catch (error) {
      debug('Create season error:', error);
      reply.originalMessage.reply.content += `${label} ❌ error:\n  - ${getErrorMessage(error)}`;
    } finally {
      await reply.editOriginalReply();
    }*/
  });
