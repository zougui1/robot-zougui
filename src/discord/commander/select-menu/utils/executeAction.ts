import { SelectMenuInteraction } from 'discord.js';
import _ from 'radash';
import createDebug from 'debug';
import chalk from 'chalk';

import { logSelectMenu } from './logSelectMenu';
import { SelectMenuActionContext } from '../types';
import { ProgramMiddleware } from '../../types';
import { Reply } from '../../../Reply';

const debug = createDebug('notion-trackers:command');

export const executeAction = async (options: ExecuteActionOptions): Promise<void> => {
  const { interaction, action, values, middlewares } = options;

  logSelectMenu(options);
  const reply = new Reply(interaction);
  reply.message.addOptions(values);

  try {
    for await (const middleware of middlewares) {
      await middleware({ interaction, reply });
    }

    await action({ interaction, options: values, reply });
  } catch (error) {
    debug(chalk.redBright('[ERROR]'), error);

    if (error instanceof Error) {
      await reply.respondError(error.message, error.cause);
    } else {
      await reply.respondError('An unknown error occured', error);
    }
  }
}

export interface ExecuteActionOptions {
  interaction: SelectMenuInteraction;
  selectMenuName: string;
  values: Record<string, string>;
  action: (context: SelectMenuActionContext<Record<string, string>>) => void | Promise<void>;
  middlewares: ProgramMiddleware[];
}
