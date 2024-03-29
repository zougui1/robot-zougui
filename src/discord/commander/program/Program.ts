import { Client, REST } from 'discord.js';
import _ from 'radash';
import createDebug from 'debug';

import { ClientState } from './ClientState';
import { createInteractionHandler, logCreatedCommands } from './utils';
import { Command, CommandMap } from '../command';
import { ComponentMap } from '../component';
import {
  AnyButton,
  ButtonMap,
  AnySelectMenu,
  SelectMenuMap,
  AnyModal,
  ModalMap,
} from '../components';
import { Middleware } from '../types';
import { initializeCommands, } from '../../utils';
import { onceProgramExit } from '../../../utils';

const debug = createDebug('robot-zougui:discord');

export class Program {
  readonly commands: CommandMap = new CommandMap();
  readonly selectMenus: SelectMenuMap = new ComponentMap();
  readonly buttons: ButtonMap = new ComponentMap();
  readonly modals: ModalMap = new ComponentMap();
  readonly #client: Client;
  readonly #rest: REST;
  readonly #token: string;
  readonly #clientId: string;
  readonly #state: ClientState;
  readonly #middlewares: Middleware[] = [];

  constructor(client: Client, options: ProgramOptions) {
    this.#client = client;
    this.#token = options.token;
    this.#clientId = options.clientId;
    this.#rest = new REST();
    this.#state = new ClientState(client);

    this._init();
  }

  addCommand(command: Command<any>): this {
    command.addMiddlewares([...this.#middlewares]);
    this.commands.add(command);
    return this;
  }

  addSelectMenu(selectMenu: AnySelectMenu): this {
    this.selectMenus.add(selectMenu);
    selectMenu.addMiddlewares([...this.#middlewares]);
    return this;
  }

  addButton(button: AnyButton): this {
    this.buttons.add(button);
    button.addMiddlewares([...this.#middlewares]);
    return this;
  }

  addModal(modal: AnyModal): this {
    this.modals.add(modal);
    modal.addMiddlewares([...this.#middlewares]);
    return this;
  }

  use(...middlewares: Middleware[]): this {
    this.#middlewares.push(...middlewares);
    return this;
  }

  async parse(): Promise<void> {
    this.#client.login(this.#token);
    await this._initializeCommands();
  }

  destroy(): void {
    this.selectMenus.destroy();
    this.buttons.destroy();
    this.#client.destroy();
  }

  //#region private methods
  private async _initializeCommands(): Promise<void> {
    const commands = this.commands.toArray();
    const result = await initializeCommands(this.#rest, this.#clientId, commands);

    if (result.success) {
      logCreatedCommands(commands);
      this.#client.on('interactionCreate', createInteractionHandler({
        commands: this.commands,
        selectMenus: this.selectMenus,
        buttons: this.buttons,
        modals: this.modals,
      }));
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
