import { Service } from './start.service';
import { contentOption } from '../options';
import { Command } from '../../../discord';

export const subCommandStart = new Command('start')
  .description('start fapping')
  .addOption(contentOption)
  .action(async ({ options, reply }) => {
    const service = new Service();

    await service.createFap(options);
    await reply.respondSuccess('The fap entry has been successfully created');
  });

export type { } from 'zod';
