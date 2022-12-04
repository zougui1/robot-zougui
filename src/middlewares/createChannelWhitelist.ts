import { MiddlewareContext } from '../discord';

export const createChannelWhitelist = (options: CreateChannelWhitelistOptions) => {
  return ({ interaction }: MiddlewareContext): void => {
    if (!options.channelIds.includes(interaction.channelId)) {
      throw new Error('You cannot do this action in this channel');
    }
  }
}

export interface CreateChannelWhitelistOptions {
  channelIds: string[];
}
