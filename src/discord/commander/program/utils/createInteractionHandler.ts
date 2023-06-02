import { Interaction } from 'discord.js';
import createDebug from 'debug';
import chalk from 'chalk';

import { handleCommandInteraction } from './handleCommandInteraction';
import { handleAutocompleteInteraction } from './handleAutocompleteInteraction';
import { CommandMap } from '../../command';
import {
  ButtonMap,
  SelectMenuMap,
  ModalMap,
} from '../../components';

const debug = createDebug('robot-zougui:discord:interaction');

export const createInteractionHandler = (options: CreateInteractionHandlerOptions) => async (interaction: Interaction): Promise<void> => {
  try {
    if (interaction.isAutocomplete()) {
      return await handleAutocompleteInteraction(interaction, options.commands);
    }

    if (interaction.isChatInputCommand()) {
      return await handleCommandInteraction(interaction, options.commands);
    }

    if (interaction.isStringSelectMenu()) {
      return await options.selectMenus.execute(interaction);
    }

    if (interaction.isButton()) {
      return await options.buttons.execute(interaction);
    }

    if (interaction.isModalSubmit()) {
      return await options.modals.execute(interaction);
    }
  } catch (error) {
    debug(chalk.redBright('[ERROR]'), error);
  }
}

export interface CreateInteractionHandlerOptions {
  commands: CommandMap;
  selectMenus: SelectMenuMap;
  buttons: ButtonMap;
  modals: ModalMap;
}
