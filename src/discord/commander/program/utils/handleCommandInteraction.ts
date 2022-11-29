import { ChatInputCommandInteraction } from 'discord.js';

import { findCommand } from './findCommand';
import { CommandMap } from '../../command';

export const handleCommandInteraction = async (interaction: ChatInputCommandInteraction, commands: CommandMap): Promise<void> => {
  const command = findCommand(interaction, commands);
  await command?.execute(interaction);
}
