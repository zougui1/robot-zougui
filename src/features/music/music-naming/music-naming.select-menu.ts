import { MusicNamingService } from './music-naming.service';
import { SelectMenu } from '../../../discord';

export const musicNamingSelectMenu = new SelectMenu('music-naming')
  .option('playlist', 'p')
  .option('fileName', 'f')
  .action(async ({ options, interaction, reply }) => {
    const service = new MusicNamingService();
    const [value] = interaction.values;

    await reply.fetchOriginalReply();

    switch (value) {
      case MusicNamingOption.originalFileName:
        await service.moveToPlaylist(options);
        reply.originalMessage.reply.content += `\nKept original file name`;
        await reply.editOriginalReply();
        await reply.respondSuccess(`The file has been added to the playlist "${options.playlist}"`);
        break;

      case MusicNamingOption.resolvedFileName:
        await service.transformFileName(options);
        reply.originalMessage.reply.content += `\nRenamed file to resolved name`;
        await reply.editOriginalReply();
        await reply.respondSuccess(`The file has been renamed and added to the playlist "${options.playlist}"`);
        break;

      case MusicNamingOption.rename:
        reply.originalMessage.reply.content += `\nManual file renaming/`;
        await reply.editOriginalReply();
        await reply.sendContent('renaming not implemented');
        break;

      default:
        throw new Error(`Music naming option "${value}" does not exist`);
    }
  });

export enum MusicNamingOption {
  originalFileName = 'originalFileName',
  resolvedFileName = 'resolvedFileName',
  rename = 'rename',
}
