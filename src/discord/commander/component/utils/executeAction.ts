import _ from 'radash';
import createDebug from 'debug';
import chalk from 'chalk';

import { logButton } from './logButton';
import { ComponentActionContext } from '../types';
import { Middleware } from '../../types';
import { ComponentInteraction } from '../../../types';
import { Reply } from '../../../Reply';

const debug = createDebug('robot-zougui:discord:component');

export const executeAction = async (options: ExecuteActionOptions): Promise<void> => {
  const { interaction, action, values, middlewares } = options;

  logButton(options);
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
  componentType: string;
  interaction: ComponentInteraction;
  buttonName: string;
  values: Record<string, string>;
  action: (context: ComponentActionContext<ComponentInteraction, Record<string, string>>) => void | Promise<void>;
  middlewares: Middleware[];
}
