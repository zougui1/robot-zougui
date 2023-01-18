import _ from 'radash';
import createDebug from 'debug';
import chalk from 'chalk';

import { MusicNamingService } from './music-naming.service';
import { Modal } from '../../../discord';

const debug = createDebug('robot-zougui:music:music-renaming:modal');

export const renamingModal = new Modal('music-renaming')
  .option('playlist', 'p')
  .option('fileName', 'f')
  .option('trackNumber', 't')
  .action(async ({ options, interaction, reply }) => {
    const trackNumber = Number(options.trackNumber);
    const title = interaction.fields.getTextInputValue('title');
    const artists = interaction.fields
      .getTextInputValue('artists')
      .trim()
      .split(',')
      .filter(artist => artist.trim());

    await reply.fetchOriginalReply();
    reply.originalComponents = [];
    reply.originalMessage.reply.content += '\n\nManual file renaming';
    await reply.editOriginalReply();

    if (!_.isNumber(trackNumber)) {
      debug(chalk.redBright('[ERROR]'), `Invalid track number: ${options.trackNumber}`);
      await reply.respondError('Invalid track number');
      return;
    }

    const service = new MusicNamingService();

    const { fileName } = await service.renameFile({
      ...options,
      title,
      artists,
      trackNumber,
    });

    await reply.respondSuccess(`The file has been renamed to "${fileName}" and added to the playlist "${options.playlist}"`);
  });
