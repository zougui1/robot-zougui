import { ApplicationCommandDataResolvable } from 'discord.js';

import type { Command } from './Command';

export class CommandMap {
  readonly commands: Record<string, Command> = {};

  add(command: Command<any>): this {
    this.commands[command.name] = command;
    return this;
  }

  get(name: string): Command | undefined {
    return this.commands[name];
  }

  /**
   * @returns the commands in an array
   */
  asArray(): Command[] {
    return Object.values(this.commands);
  }

  /**
   * @returns the commands converted to objects
   */
  toArray(): ApplicationCommandDataResolvable[] {
    return this.asArray().map(command => command.toCommandObject());
  }

  isEmpty(): boolean {
    return Object.values(this.commands).length === 0;
  }
}
