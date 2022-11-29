import { Service } from './watch-start.service';
import { seasonsOption } from './options';
import { createNameOption } from '../options';
import { Command } from '../../../discord';

export const subCommandWatchStart = new Command('watch-start')
  .description('start watching a show')
  .addOption(createNameOption({ watching: false }))
  .addOption(seasonsOption)
  .action(async ({ options, reply }) => {
    const service = new Service();

    const result = await service.startWatchingShow({
      name: options.name,
      seasons: options.seasons || [],
    });

    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
