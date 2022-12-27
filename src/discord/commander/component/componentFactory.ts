import { Constructor } from 'type-fest';

import { Component } from './Component';
import { ComponentBuilder } from './types';
import { ComponentInteraction } from '../../types';

export const componentFactory = <
  Interaction extends ComponentInteraction,
  Builder extends ComponentBuilder,
>(type: string, builder: Constructor<Builder>): Constructor<Component<Interaction, Builder>> => {
  return class SpecificComponent<
    Options extends Record<string, string> = Record<string, string>,
  > extends Component<Interaction, Builder, Options> {
    constructor(name: string) {
      super(type, builder, name);
    }
  }
}
