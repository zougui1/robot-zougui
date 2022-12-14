import { z } from 'zod';
import { DateTime } from 'luxon';

import { ReadStartService } from './read-start.service';
import { chaptersOption } from './options';
import { createNameOption } from '../options';
import { Command } from '../../../discord';

export const subCommandReadStart = new Command('read-start')
  .description('Start reading a story')
  .addOption(createNameOption({ reading: false }))
  .addOption(chaptersOption)
  .option('[fap-start]', 'Start fapping on this story', {
    schema: z.boolean(),
  })
  .action(async ({ options, reply }) => {
    const service = new ReadStartService();

    const result = await service.startReadingStory({
      ...options,
      chapters: options.chapters || [],
      date: DateTime.now(),
    });

    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
