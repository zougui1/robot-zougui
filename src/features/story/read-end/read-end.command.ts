import { z } from 'zod';
import { DateTime } from 'luxon';

import { ReadEndService } from './read-end.service';
import { createNameOption } from '../options';
import { Command } from '../../../discord';

export const subCommandReadEnd = new Command('read-end')
  .description('stop reading a story')
  .addOption(createNameOption({ reading: true }))
  .option('[fap-end]', 'Finish fapping on this story', {
    schema: z.boolean(),
  })
  .action(async ({ options, reply }) => {
    reply.defer();
    const service = new ReadEndService();
    const result = await service.stopReadingStory({
      ...options,
      date: DateTime.now(),
    });
    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
