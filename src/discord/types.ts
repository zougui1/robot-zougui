import {
  ChatInputCommandInteraction,
  SelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

export type ReplyableInteraction = (
  | ChatInputCommandInteraction
  | SelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction
)

export type ComponentInteraction = (
  | SelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction
)
