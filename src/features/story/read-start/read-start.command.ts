import { Service } from './read-start.service';
import { chaptersOption } from './options';
import { createNameOption } from '../options';
import { Command } from '../../../discord';

export const subCommandReadStart = new Command('read-start')
  .description('Start reading a story')
  .addOption(createNameOption({ reading: false }))
  .addOption(chaptersOption)
  .action(async ({ options, reply }) => {
    const service = new Service();

    const result = await service.startReadingStory({
      name: options.name,
      chapters: options.chapters || [],
    });

    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
