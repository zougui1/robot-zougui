import { ChatInputCommandInteraction } from 'discord.js';
import createDebug from 'debug';
import chalk from 'chalk';

const debug = createDebug('notion-trackers:command');

export const logCommand = async (options: LogCommandOptions): Promise<void> => {
  const { interaction, values, rawValues } = options;

  const commandName = chalk.cyan(interaction.commandName);
  const subCommandName = interaction.options.getSubcommand(false);
  const debugMessage = subCommandName
    ? `Executing sub-command ${commandName} ${chalk.cyanBright(subCommandName)}`
    : `Executing command ${commandName}`;

  debug(debugMessage);

  const debugOptions = Object.entries(values).reduce((debugOptions, [name, value]) => {
    if (value !== undefined) {
      debugOptions[name] = rawValues[name] === undefined
        ? { defaultValue: value }
        : { value };
    }

    return debugOptions;
  }, {} as Record<string, unknown>);

  debug('With options:', JSON.stringify(debugOptions, null, 2));
}

export interface LogCommandOptions {
  interaction: ChatInputCommandInteraction;
  values: Record<string, unknown>;
  rawValues: Record<string, unknown>;
}
