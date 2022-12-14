import { z } from 'zod';
import createDebug from 'debug';
import chalk from 'chalk';

import { toMs } from '@zougui/common.ms';

import { CreatePrivateChapterService } from './create-private-chapter.service';
import { storyNameOption } from '../create-chapter/options';
import { Command } from '../../../discord';
import { createChannelWhitelist } from '../../../middlewares';
import env from '../../../env';

const debug = createDebug('robot-zougui:story:create-private-chapter:command');

const fileMessageTimeout = toMs('30 minutes');

export const subCommandCreatePrivateChapter = new Command('create-private-chapter')
  .use(createChannelWhitelist({ channelIds: env.discord.channelIds.private }))
  .description('Create a new private chapter for a given story')
  .addOption(storyNameOption)
  .option('[chapter-name]', 'Name of the chapter')
  .option('[index]', 'Index of the chapter, default = lastFoundIndex + 1', {
    schema: z.number().positive(),
  })
  .option('[start-read]', 'Start reading the newly created chapter', {
    schema: z.boolean(),
  })
  .option('[start-fap]', 'Start fapping on the newly created chapter', {
    schema: z.boolean(),
  })
  .action(async ({ options, reply, interaction }) => {
    reply.defer();

    if (!interaction.channel) {
      await reply.respondError('Could not wait for a file to be sent via a message');
      return;
    }

    const [messageEntry] = await interaction.channel.awaitMessages({
      max: 1,
      time: fileMessageTimeout,
      filter: message => message.attachments.size >= 1
    });

    if (!messageEntry) {
      await reply.respondError('No file via a message was sent');
      return;
    }

    const [, message] = messageEntry;
    const [file] = message.attachments.values();

    if (!file.name) {
      await reply.respondError('The file provided does not have a name');
      return;
    }

    const service = new CreatePrivateChapterService();

    const result = await service.createChapter({
      ...options,
      fileUrl: file.url,
      fileName: file.name,
      onProgress: async progress => {
        await reply.sendContent(progress);
      },
    });

    message.delete().catch(error => {
      debug(chalk.red('[ERROR]'), error);
    });

    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
