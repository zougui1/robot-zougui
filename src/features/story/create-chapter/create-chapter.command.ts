import { z } from 'zod';
import { Message, AttachmentBuilder } from 'discord.js';
import createDebug from 'debug';
import chalk from 'chalk';

import { CreateChapterService } from './create-chapter.service';
import { storyNameOption } from './options';
import { Command } from '../../../discord';

const debug = createDebug('robot-zougui:story:create-chapter:command');

export const subCommandCreateChapter = new Command('create-chapter')
  .description('Create a new chapter for a given story')
  .addOption(storyNameOption)
  .option('<url>', 'URL where the story can be found', {
    schema: z.string().url(),
  })
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
    const service = new CreateChapterService();

    let tempMessage: Message | undefined;

    const result = await service.createChapterFromSubmission({
      ...options,
      onProgress: async progress => {
        await reply.sendContent(progress);
      },

      getFileUrl: async (file: Buffer, name: string): Promise<string | undefined> => {
        const attachment = new AttachmentBuilder(file).setName(name);
        const message = await interaction.channel?.send({
          files: [attachment],
        });

        tempMessage = message;
        return message?.attachments.at(0)?.url;
      },
    });

    if (tempMessage) {
      tempMessage?.delete().catch(error => {
        debug(chalk.red('[ERROR]'), error);
      });
    }

    await reply.respondSuccess(result.message);
  });

export type { } from 'zod';
