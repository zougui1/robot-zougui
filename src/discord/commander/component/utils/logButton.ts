import createDebug from 'debug';
import chalk from 'chalk';

const debug = createDebug('robot-zougui:discord:component');

export const logButton = async (options: LogCommandOptions): Promise<void> => {
  const { values, buttonName, componentType } = options;

  debug(`Executing ${chalk.blueBright(componentType)} ${chalk.cyan(buttonName)}`);
  debug('With options:', JSON.stringify(values, null, 2));
}

export interface LogCommandOptions {
  componentType: string;
  buttonName: string;
  values: Record<string, string>;
}
