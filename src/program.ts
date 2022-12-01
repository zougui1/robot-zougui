import { Client, GatewayIntentBits } from 'discord.js';
import createDebug from 'debug';

import './pretty-error';
import { Program } from './discord';
import { fapCommand } from './features/fap';
import { showCommand } from './features/show';
import { storyCommand } from './features/story';
import { musicCommand, musicNamingSelectMenu } from './features/music';
import { createAuthorizer } from './middlewares';
import { Network, NetworkStatus } from './utils';
import env from './env';

const debug = createDebug('robot-zougui:program');

const createProgram = async (): Promise<Program> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessages,
    ],
  });

  const program = new Program(client, env.discord);

  program.use(createAuthorizer({ authorizedUserIds: [env.discord.authorizedUserId] }));

  program.addCommand(fapCommand);
  program.addCommand(showCommand);
  program.addCommand(storyCommand);
  program.addCommand(musicCommand);

  program.addSelectMenu(musicNamingSelectMenu);

  await program.parse();

  const guildList = await client.guilds.fetch();

  const channelIds = [env.discord.channelId];

  for (const guildItem of guildList.values()) {
    const guild = await guildItem.fetch();
    const channelList = await guild.channels.fetch();

    for (const channelItem of channelList.values()) {
      if (channelItem && channelIds.includes(channelItem.id)) {
        await channelItem?.fetch();
      }
    }
  }

  return program;
}

const run = async (): Promise<void> => {
  const network = new Network({
    address: env.networkAddress,
  });

  const status = network.getStatus();

  debug('network status:', status);
  network.on('change', ({ status }) => {
    debug('new network status:', status);
  });

  // create the program if connected to the network
  if (status === NetworkStatus.online) {
    const program = await createProgram();
    // if disconnected from the network then we destroy the program
    await network.once('offline');
    program.destroy();
  }

  // once reconnected to the network we re-run the program
  await network.once('online');
  network.destroy();
  run();
}

run();
