import { ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import createDebug from 'debug';

import { Command, CommandMap } from '../../command';

const debug = createDebug('robot-zougui:discord');

export const findCommand = (interaction: Interaction, commands: CommandMap): Command | undefined => {
  const command = commands.get(interaction.commandName);

  if (!command) {
    debug(`There is no command "${interaction.commandName}"`);
    return;
  }

  const subCommandName = interaction.options.getSubcommand(false);

  if (!subCommandName) {
    return command;
  }

  const subCommand = command.commands.get(subCommandName);

  if (!subCommand) {
    debug(`There is no sub-command "${subCommandName}"`);
    return;
  }

  return subCommand;
}

export type Interaction = ChatInputCommandInteraction | AutocompleteInteraction;
