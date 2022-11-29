import './pretty-error';
import { client } from './client';
import { Program } from './discord';
import { fapCommand } from './features/fap';
import { showCommand } from './features/show';
import { storyCommand } from './features/story';
import { musicCommand, musicNamingSelectMenu } from './features/music';
import { createAuthorizer } from './middlewares';
import { discord } from './env';

const program = new Program(client, discord);

program.use(createAuthorizer({ authorizedUserIds: [discord.authorizedUserId] }));

program.addCommand(fapCommand);
program.addCommand(showCommand);
program.addCommand(storyCommand);
program.addCommand(musicCommand);

program.addSelectMenu(musicNamingSelectMenu);

program.parse().then(async () => {
  const guildList = await client.guilds.fetch();

  for (const guildItem of guildList.values()) {
    const guild = await guildItem.fetch();
    const channelList = await guild.channels.fetch();

    for (const channelItem of channelList.values()) {
      if (channelItem && discord.channelNames.includes(channelItem.name)) {
        await channelItem?.fetch();
      }
    }
  }
});
