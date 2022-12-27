import createDebug from 'debug';

import { ComponentId } from './id';
import type { Component } from './Component';
import { ComponentInteraction } from '../../types';

const debug = createDebug('robot-zougui:discord:command-map');

export class ComponentMap<Interaction extends ComponentInteraction, T extends Component<Interaction, any, any>> {
  readonly components: Record<string, T> = {};

  add(component: T): this {
    this.components[component.name] = component;
    return this;
  }

  get(name: string): { component: T; payload: Record<string, unknown> } | undefined {
    try {
      const payload = ComponentId.decode(name);
      const payloadName = ComponentId.getNameFromAlias(payload);

      if (!payloadName) {
        return;
      }

      const component = this.components[payloadName];

      if (component) {
        return { component, payload };
      }
    } catch (error) {
      debug('get component error:', error);
    }
  }

  execute = async (interaction: Interaction): Promise<void> => {
    const result = this.get(interaction.customId);

    if (!result) {
      return;
    }

    await result.component.execute(interaction, result.payload);
  }

  destroy(): void {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
