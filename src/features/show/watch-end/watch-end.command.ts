import { Service } from './watch-end.service';
import { createNameOption } from '../options';
import { Command } from '../../../discord';

export const subCommandWatchEnd = new Command('watch-end')
  .description('stop watching a show')
  .addOption(createNameOption({ watching: true }))
  .action(async ({ options, reply }) => {
    const service = new Service();
    const result = await service.stopWatchingShow({ name: options.name });
    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
