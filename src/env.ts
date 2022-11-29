import { config } from 'dotenv';
import env from 'env-var';

config();

export const discord = {
  token: env.get('DISCORD_TOKEN').required().asString(),
  clientId: env.get('DISCORD_CLIENT_ID').required().asString(),
  channelNames: env.get('DISCORD_CHANNEL_NAMES').required().asArray(','),
  authorizedUserId: env.get('DISCORD_AUTHORIZED_USER_ID').required().asString(),
};

export const notion = {
  token: env.get('NOTION_TOKEN').required().asString(),
  databases: {
    fap: {
      id: env.get('NOTION_DATABASE_FAP_ID').required().asString(),
    },
    shows: {
      id: env.get('NOTION_DATABASE_SHOWS_ID').required().asString(),
    },
    seasons: {
      id: env.get('NOTION_DATABASE_SEASONS_ID').required().asString(),
    },
    watchTrace: {
      id: env.get('NOTION_DATABASE_WATCH_TRACE_ID').required().asString(),
    },
    stories: {
      id: env.get('NOTION_DATABASE_STORIES_ID').required().asString(),
    },
    chapters: {
      id: env.get('NOTION_DATABASE_CHAPTERS_ID').required().asString(),
    },
    readTrace: {
      id: env.get('NOTION_DATABASE_READ_TRACE_ID').required().asString(),
    },
  },
  stats: {
    fapping: {
      id: env.get('NOTION_STATS_FAPPING_ID').required().asString(),
    },
    read: {
      id: env.get('NOTION_STATS_READ_ID').required().asString(),
    },
  },
};

export const music = {
  dir: env.get('MUSIC_DIR').required().asString(),
  tempDir: env.get('MUSIC_TEMP_DIR').required().asString(),
};
