import {
  ApplicationCommandDataResolvable,
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

export const isChatInputCommand = (command: ApplicationCommandDataResolvable): command is (ChatInputApplicationCommandData | RESTPostAPIChatInputApplicationCommandsJSONBody) => {
  return 'type' in command && command.type === ApplicationCommandType.ChatInput;
}
