import { DateTime } from 'luxon';

import { StartService } from './start.service';
import { contentOption } from '../options';
import { Command } from '../../../discord';

export const subCommandStart = new Command('start')
  .description('start fapping')
  .addOption(contentOption)
  .action(async ({ options, reply }) => {
    const service = new StartService();

    await service.createFap({
      ...options,
      date: DateTime.now(),
    });
    await reply.respondSuccess('You started fapping');
  });

export type { } from 'zod';
