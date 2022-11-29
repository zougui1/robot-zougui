import { ChatInputCommandInteraction } from 'discord.js';

export const getRawInteractionOptions = (interaction: ChatInputCommandInteraction, options: { name: string }[]): Record<string, unknown> => {
  return options.reduce((optionsObject, option) => {
    optionsObject[option.name] = interaction.options.get(option.name)?.value;
    return optionsObject;
  }, {} as Record<string, unknown>);
}
