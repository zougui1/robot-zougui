import { EndService } from './end.service';
import { contentOption } from '../options';
import { Command } from '../../../discord';

export const subCommandEnd = new Command('end')
  .description('stop fapping')
  .addOption(contentOption)
  .action(async ({ options, reply }) => {
    const service = new EndService();

    await service.finishLastFap(options);
    await reply.respondSuccess('The fap entry has been successfully updated');
  });

export type { } from 'zod';
