import { Client, REST } from 'discord.js';
import _ from 'radash';
import createDebug from 'debug';

import { ClientState } from './ClientState';
import { createInteractionHandler, logCreatedCommands } from './utils';
import { Command, CommandMap } from '../command';
import { SelectMenu, SelectMenuMap } from '../select-menu';
import { ProgramMiddleware } from '../types';
import { initializeCommands, } from '../../utils';
import { onceProgramExit } from '../../../utils';

const debug = createDebug('notion-trackers:discord');

export class Program {
  readonly commands: CommandMap = new CommandMap();
  readonly selectMenus: SelectMenuMap = new SelectMenuMap();
  readonly #client: Client;
  readonly #rest: REST;
  readonly #token: string;
  readonly #clientId: string;
  readonly #state: ClientState;
  readonly #middlewares: ProgramMiddleware[] = [];

  constructor(client: Client, options: ProgramOptions) {
    this.#client = client;
    this.#token = options.token;
    this.#clientId = options.clientId;
    this.#rest = new REST();
    this.#state = new ClientState(client);

    this._init();
  }

  addCommand(command: Command<any>): this {
    // gotta copy the array as its referenced value is modified by `this.use`
    command.addMiddlewares([...this.#middlewares]);
    this.commands.add(command);
    return this;
  }

  addSelectMenu(selectMenu: SelectMenu<any>): this {
    this.selectMenus.add(selectMenu);
    return this;
  }

  use(...middlewares: ProgramMiddleware[]): this {
    this.#middlewares.push(...middlewares);
    return this;
  }

  async parse(): Promise<void> {
    this.#client.login(this.#token);
    await this._initializeCommands();
  }

  //#region private methods
  private async _initializeCommands(): Promise<void> {
    const commands = this.commands.toArray();
    const result = await initializeCommands(this.#rest, this.#clientId, commands);

    if (result.success) {
      logCreatedCommands(commands);
      this.#client.on('interactionCreate', createInteractionHandler(this.commands, this.selectMenus));
      await this.#state.setInitializedPresence();
    } else {
      await this.#state.setInitializationErrorPresence();
    }
  }

  private _destroy = () => {
    debug('destroy discord bot');
    this.#client.destroy();
  }

  private _init(): void {
    this.#rest.setToken(this.#token);

    this.#client.once('ready', async client => {
      debug(`Logged in as ${client.user.tag}`);
      await this.#state.setReadyPresence();
    });

    onceProgramExit(this._destroy);
  }
  //#endregion
}

export interface ProgramOptions {
  token: string;
  clientId: string;
}
