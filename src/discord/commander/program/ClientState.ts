import { Client } from 'discord.js';

export class ClientState {
  readonly #client: Client;

  constructor(client: Client) {
    this.#client = client;
  }

  async getReadyClient(): Promise<Client<true>> {
    if (this.#client.isReady()) {
      return this.#client;
    }

    return await new Promise<Client<true>>((resolve, reject) => {
      this.#client.once('ready', resolve);
      this.#client.once('error', reject);
    });
  }

  //#region presences
  setReadyPresence = async (): Promise<void> => {
    const client = await this.getReadyClient();

    client.user.setPresence({
      status: 'idle',
      activities: [
        { name: 'Initializing commands...' },
      ],
    });
  }

  setInitializationErrorPresence = async (): Promise<void> => {
    const client = await this.getReadyClient();

    client.user.setPresence({
      status: 'idle',
      activities: [
        { name: 'Could not get the commands ready to use' },
      ],
    });
  }

  setInitializedPresence = async (): Promise<void> => {
    const client = await this.getReadyClient();

    client.user.setStatus('online');
    // null is supported (to clear the activity) but not in the types
    client.user.setActivity(null as any);
  }
  //#endregion
}
