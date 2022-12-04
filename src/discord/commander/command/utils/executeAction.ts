import { ChatInputCommandInteraction } from 'discord.js';
import _ from 'radash';
import createDebug from 'debug';
import chalk from 'chalk';

import { cleanReply } from './cleanReply';
import { logCommand } from './logCommand';
import { ActionContext } from '../types';
import { CommandMiddleware } from '../types';
import { Reply } from '../../../Reply';
import { onceProgramExit } from '../../../../utils';

const debug = createDebug('robot-zougui:command');

const camelAll = (object: Record<string, unknown>): Record<string, unknown> => {
  return Object.entries(object).reduce((obj, [key, value]) => {
    obj[_.camel(key)] = value;
    return obj;
  }, {} as Record<string, unknown>);
}

export const executeAction = async (options: ExecuteActionOptions): Promise<void> => {
  const { interaction, action, middlewares } = options;
  const values = camelAll(options.values);

  logCommand(options);
  const reply = new Reply(interaction, { debug: options.debug });
  reply.message.addOptions(values);

  const removeExitListener = onceProgramExit(async () => {
    await cleanReply(interaction, reply);
  });

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
  } finally {
    removeExitListener();
  }
}

export interface ExecuteActionOptions {
  interaction: ChatInputCommandInteraction;
  values: Record<string, unknown>;
  rawValues: Record<string, unknown>;
  action: (context: ActionContext<Record<string, unknown>>) => void | Promise<void>;
  debug?: boolean | undefined;
  middlewares: CommandMiddleware[];
}
