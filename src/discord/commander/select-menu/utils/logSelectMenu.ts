import createDebug from 'debug';
import chalk from 'chalk';

const debug = createDebug('robot-zougui:select-menu');

export const logSelectMenu = async (options: LogCommandOptions): Promise<void> => {
  const { values, selectMenuName } = options;

  debug(`Executing select-menu ${chalk.cyan(selectMenuName)}`);
  debug('With options:', JSON.stringify(values, null, 2));
}

export interface LogCommandOptions {
  selectMenuName: string;
  values: Record<string, string>;
}
