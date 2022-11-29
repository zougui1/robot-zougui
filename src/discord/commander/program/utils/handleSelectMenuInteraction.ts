import { SelectMenuInteraction } from 'discord.js';

import { SelectMenuMap } from '../../select-menu';

export const handleSelectMenuInteraction = async (interaction: SelectMenuInteraction, selectMenus: SelectMenuMap): Promise<void> => {
  const result = selectMenus.get(interaction.customId);

  if (!result) {
    return;
  }

  await result.menu.execute(interaction, result.payload);
}
