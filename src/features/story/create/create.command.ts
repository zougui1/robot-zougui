import { z } from 'zod';

//import { ReadEndService } from './read-end.service';
import { Command } from '../../../discord';

export const subCommandCreateChapter = new Command('create-chapter')
  .description('Create a new chapter for a given story')
  // TODO autocompletion of existing stories
  .option('<story-name>', 'Name of the story')
  .option('<url>', 'URL where the story can be found', {
    schema: z.string().url(),
  })
  .option('[chapter-name]', 'Name of the chapter')
  .option('[index]', 'Index of the chapter, default = lastFoundIndex + 1', {
    schema: z.number().positive(),
  })
  .action(async ({ options, reply }) => {
    await reply.respond('Not implemented');
  });

export type { } from 'zod';
