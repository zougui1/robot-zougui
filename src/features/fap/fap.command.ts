import { subCommandStart } from './start';
import { subCommandEnd } from './end';
import { Command } from '../../discord';

export const fapCommand = new Command('fap').description('Fap command');
// for type inference; otherwise the above line will result in a compile-time error
export type { } from 'zod';

fapCommand.addCommand(subCommandStart);
fapCommand.addCommand(subCommandEnd);
