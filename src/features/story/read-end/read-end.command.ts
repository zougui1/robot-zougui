import { ReadEndService } from './read-end.service';
import { createNameOption } from '../options';
import { Command } from '../../../discord';

export const subCommandReadEnd = new Command('read-end')
  .description('stop reading a story')
  .addOption(createNameOption({ reading: true }))
  .action(async ({ options, reply }) => {
    const service = new ReadEndService();
    const result = await service.stopReadingStory({ name: options.name });
    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
