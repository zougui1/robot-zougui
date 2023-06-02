import { subCommandStart } from './start';
import { Command } from '../../discord';

export const exerciseCommand = new Command('exercise').description('Exercise command');
// for type inference; otherwise the above line will result in a compile-time error
export type { } from 'zod';

exerciseCommand.addCommand(subCommandStart);
