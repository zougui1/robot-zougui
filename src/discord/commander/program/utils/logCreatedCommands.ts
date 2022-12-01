import { ApplicationCommandDataResolvable, ApplicationCommandOptionType } from 'discord.js';
import createDebug from 'debug';
import chalk from 'chalk';

import { isChatInputCommand } from '../../../utils';

const debug = createDebug('robot-zougui:discord');

export const logCreatedCommands = (commands: ApplicationCommandDataResolvable[]): void => {
  for (const command of commands) {
    if (!isChatInputCommand(command)) {
      continue;
    }

    const coloredCommandName = chalk.cyan(command.name);

    debug(`Created command ${coloredCommandName}`);
    const options = command.options || [];
    const areSubCommands = [...options].every(option => option.type === ApplicationCommandOptionType.Subcommand);

    if (areSubCommands) {
      for (const option of options) {
        debug(`Created sub-command ${coloredCommandName} ${chalk.cyanBright(option.name)}`);
      }
    }
  }
}
