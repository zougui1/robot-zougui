import { DiscordjsError } from 'discord.js';

export const hasDiscordWebhookTokenExpired = (error: unknown): boolean => {
  return (
    error instanceof DiscordjsError &&
    error.message === 'invalid webhook token'
  );
}
