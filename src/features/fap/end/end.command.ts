import { DateTime } from 'luxon';

import { EndService } from './end.service';
import { contentOption } from '../options';
import { Command } from '../../../discord';

export const subCommandEnd = new Command('end')
  .description('stop fapping')
  .addOption(contentOption)
  .action(async ({ options, reply }) => {
    const service = new EndService();

    const { duration } = await service.finishLastFap({
      ...options,
      date: DateTime.now(),
    });
    await reply.respondSuccess(`You finished fapping after ${duration}`);
  });

export type { } from 'zod';
