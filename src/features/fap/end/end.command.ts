import { DateTime } from 'luxon';

import { EndService } from './end.service';
import { createContentOption } from '../options';
import { Command } from '../../../discord';

export const subCommandEnd = new Command('end')
  .description('stop fapping')
  .addOption(createContentOption())
  .action(async ({ options, reply }) => {
    const service = new EndService();

    const { duration, content } = await service.finishLastFap({
      ...options,
      date: DateTime.now(),
    });

    const contentMessage = content ? ` on ${content}` : ''
    await reply.respondSuccess(`You finished fapping${contentMessage} after ${duration}`);
  });

export type { } from 'zod';
