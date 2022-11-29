import { ChatInputCommandInteraction } from 'discord.js';
import _ from 'radash';

import { Reply } from '../../../Reply';

export const cleanReply = async (interaction: ChatInputCommandInteraction, reply: Reply): Promise<void> => {
  const [error, message] = await _.try(interaction.fetchReply)();

  if (error || !message) {
    return;
  }

  try {
    await reply.disableDebug();
  } finally {
    process.exit();
  }
}
