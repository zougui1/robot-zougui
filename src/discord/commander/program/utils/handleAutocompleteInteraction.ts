import { AutocompleteInteraction } from 'discord.js';
import _ from 'radash';
import createDebug from 'debug';
import chalk from 'chalk';

import { findCommand } from './findCommand';
import { CommandMap } from '../../command';

const debug = createDebug('robot-zougui:discord:autocompletion');
const maxOptions = 25;

export const handleAutocompleteInteraction = async (interaction: AutocompleteInteraction, commands: CommandMap): Promise<void> => {
  const command = findCommand(interaction, commands);

  if (!command) {
    return;
  }

  const focusedOption = interaction.options.getFocused(true);

  if (!focusedOption) {
    debug(`There is no option focused`);
    return;
  }

  const option = command.options.get(focusedOption.name);

  if (!option) {
    debug(`There is no option "${focusedOption.name}"`);
  }

  if (!option?._autocomplete) {
    debug(`The option "${focusedOption.name}" has no autocompletion handler`);
    return;
  }

  const [error, maybeOptions] = await _.try(option._autocomplete)({
    interaction,
    value: focusedOption.value,
    option,
  });

  if (error) {
    debug(chalk.redBright('[ERROR]'), error);
    return await interaction.respond([]);
  }

  const options = maybeOptions.slice(0, maxOptions) || [];

  const optionObjects = options.map(option => {
    return typeof option === 'string'
      ? { name: option, value: option }
      : option;
  });

  await interaction.respond(optionObjects);
}
