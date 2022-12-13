import { DateTime } from 'luxon';

import { StartService } from './start.service';
import { FapContentType } from '../FapContentType';
import { createContentOption } from '../options';
import { Command } from '../../../discord';

export const subCommandStart = new Command('start')
  .description('start fapping')
  .addOption(createContentOption({ defaultValue: FapContentType.Art }))
  .action(async ({ options, reply }) => {
    const service = new StartService();

    await service.createFap({
      ...options,
      date: DateTime.now(),
    });
    await reply.respondSuccess(`You started fapping on ${options.content}`);
  });

export type { } from 'zod';
