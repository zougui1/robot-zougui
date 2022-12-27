import {
  SelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,

  SelectMenuBuilder,
  ButtonBuilder,
  ModalBuilder,
} from 'discord.js';

import { componentFactory, Component, ComponentMap } from './component';

export const SelectMenu = componentFactory<SelectMenuInteraction, SelectMenuBuilder>('select-menu', SelectMenuBuilder);
export type SelectMenuMap = ComponentMap<SelectMenuInteraction, InstanceType<typeof SelectMenu>>;
export type AnySelectMenu = Component<SelectMenuInteraction, SelectMenuBuilder, any>;

export const Button = componentFactory<ButtonInteraction, ButtonBuilder>('button', ButtonBuilder);
export type ButtonMap = ComponentMap<ButtonInteraction, InstanceType<typeof Button>>;
export type AnyButton = Component<ButtonInteraction, ButtonBuilder, any>;

export const Modal = componentFactory<ModalSubmitInteraction, ModalBuilder>('modal', ModalBuilder);
export type ModalMap = ComponentMap<ModalSubmitInteraction, InstanceType<typeof Modal>>;
export type AnyModal = Component<ModalSubmitInteraction, ModalBuilder, any>;
