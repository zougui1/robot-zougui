import { subCommandReadStart } from './read-start';
import { subCommandReadEnd } from './read-end';
import { subCommandCreateChapter } from './create-chapter';
import { subCommandCreatePrivateChapter } from './create-private-chapter';
import { Command } from '../../discord';

export const storyCommand = new Command('story').description('Story command');
// for type inference; otherwise the above line will result in a compile-time error
export type { } from 'zod';

storyCommand.addCommand(subCommandReadStart);
storyCommand.addCommand(subCommandReadEnd);
storyCommand.addCommand(subCommandCreateChapter);
storyCommand.addCommand(subCommandCreatePrivateChapter);
