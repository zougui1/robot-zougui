import { subCommandWatchStart } from './watch-start';
import { subCommandWatchEnd } from './watch-end';
import { Command } from '../../discord';

export const showCommand = new Command('show').description('Show command');
// for type inference; otherwise the above line will result in a compile-time error
export type { } from 'zod';

showCommand.addCommand(subCommandWatchStart);
showCommand.addCommand(subCommandWatchEnd);
