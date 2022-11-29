import { subCommandDownload } from './download';
import { Command } from '../../discord';

export const musicCommand = new Command('music').description('Music command');
// for type inference; otherwise the above line will result in a compile-time error
export type { } from 'zod';

musicCommand.addCommand(subCommandDownload);
