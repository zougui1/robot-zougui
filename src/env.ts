import path from 'node:path';

import { config } from 'dotenv';
import env from 'env-var';

config({
  path: path.join(__dirname, '../.env'),
});

const getProdEnv = () => {
  return {
    networkAddress: env.get('NETWORK_ADDRESS').required().asString(),

    discord: {
      token: env.get('DISCORD.TOKEN').required().asString(),
      clientId: env.get('DISCORD.CLIENT_ID').required().asString(),
      channelId: env.get('DISCORD.CHANNEL_ID').required().asString(),
      authorizedUserId: env.get('DISCORD.AUTHORIZED_USER_ID').required().asString(),

      icons: {
        success: env.get('DISCORD.ICONS.SUCCESS').required().asString(),
        running: env.get('DISCORD.ICONS.RUNNING').required().asString(),
        error: env.get('DISCORD.ICONS.ERROR').required().asString(),
      },
    },

    notion: {
      token: env.get('NOTION.TOKEN').required().asString(),
      databases: {
        fap: {
          id: env.get('NOTION.DATABASE.FAP.ID').required().asString(),
        },
        shows: {
          id: env.get('NOTION.DATABASE.SHOWS.ID').required().asString(),
        },
        seasons: {
          id: env.get('NOTION.DATABASE.SEASONS.ID').required().asString(),
        },
        watchTrace: {
          id: env.get('NOTION.DATABASE.WATCH_TRACE.ID').required().asString(),
        },
        stories: {
          id: env.get('NOTION.DATABASE.STORIES.ID').required().asString(),
        },
        chapters: {
          id: env.get('NOTION.DATABASE.CHAPTERS.ID').required().asString(),
        },
        readTrace: {
          id: env.get('NOTION.DATABASE.READ_TRACE.ID').required().asString(),
        },
      },
      stats: {
        fapping: {
          id: env.get('NOTION.STATS.FAPPING.ID').required().asString(),
        },
        read: {
          id: env.get('NOTION.STATS.READ.ID').required().asString(),
        },
      },
    },

    music: {
      dir: env.get('MUSIC.DIR').required().asString(),
      tempDir: env.get('MUSIC.TEMP_DIR').required().asString(),
    },
  };
}

export default getProdEnv();
