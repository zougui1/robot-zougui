import { Interaction } from 'discord.js';
import createDebug from 'debug';
import chalk from 'chalk';

import { handleCommandInteraction } from './handleCommandInteraction';
import { handleSelectMenuInteraction } from './handleSelectMenuInteraction';
import { handleAutocompleteInteraction } from './handleAutocompleteInteraction';
import { CommandMap } from '../../command';
import { SelectMenuMap } from '../../select-menu';

const debug = createDebug('robot-zougui:discord:interaction');

export const createInteractionHandler = (commands: CommandMap, selectMenus: SelectMenuMap) => async (interaction: Interaction): Promise<void> => {
  try {
    if (interaction.isAutocomplete()) {
      return await handleAutocompleteInteraction(interaction, commands);
    }

    if (interaction.isChatInputCommand()) {
      return await handleCommandInteraction(interaction, commands);
    }

    if (interaction.isSelectMenu()) {
      return await handleSelectMenuInteraction(interaction, selectMenus);
    }
  } catch (error) {
    debug(chalk.redBright('[ERROR]'), error);
  }
}
