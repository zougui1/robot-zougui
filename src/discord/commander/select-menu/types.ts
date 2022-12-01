import { SelectMenuInteraction } from 'discord.js';

import { Reply } from '../../Reply';

export interface SelectMenuActionContext<Options extends Record<string, string>> {
  interaction: SelectMenuInteraction;
  options: Options;
  reply: Reply;
}