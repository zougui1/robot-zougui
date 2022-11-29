import { REST, ApplicationCommandDataResolvable, Routes } from 'discord.js';
import _ from 'radash';
import createDebug from 'debug';

const debug = createDebug('notion-trackers:discord');

export const initializeCommands = async (rest: REST, clientId: string, commands: ApplicationCommandDataResolvable[]): Promise<InitializeCommandsResult> => {
  debug('Started refreshing application (/) commands.');

  const [error] = await _.try(rest.put.bind(rest))(Routes.applicationCommands(clientId), { body: commands });

  if (error) {
    debug('Command initialization error:', error);
    console.error(`An error occured while trying to reload application (/) commands: ${error.message}`);
    return { success: false };
  }

  debug('Successfully reloaded application (/) commands.');
  return { success: true };
}

export interface InitializeCommandsResult {
  success: boolean;
}
