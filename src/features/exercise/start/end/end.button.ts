import { Button } from '../../../../discord';

export const endButton = new Button('end-exercise')
  .action(async ({ reply }) => {
    await reply.fetchOriginalReply();
    reply.removeOriginalComponents();
    reply.originalMessage.reply.content += '\nExercise finished';
    await reply.editOriginalReply();
  });
