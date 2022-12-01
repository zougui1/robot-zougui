import os from 'node:os';

import Emittery from 'emittery';
import minimatch from 'minimatch';

import { DurationString, toMs } from '@zougui/common.ms';

import { compact } from '../utils';

const defaultOptions = {
  interval: '1 minute',
} satisfies Partial<NetworkOptions>;

export class Network extends Emittery<NetworkEventMap> {
  #status: NetworkStatus;
  #address: string;
  #interval: number;
  #intervalId: NodeJS.Timer;

  constructor(options: NetworkOptions) {
    super();

    this.#address = options.address;
    this.#interval = toMs(options.interval ?? defaultOptions.interval);
    this.#status = this.findStatus();
    this.#intervalId = this.init();
  }

  getStatus(): NetworkStatus {
    return this.#status;
  }

  destroy(): void {
    clearTimeout(this.#intervalId);
  }

  private findStatus(): NetworkStatus {
    const network = os.networkInterfaces();
    const networkInterfaces = compact(Object.values(network).flat());

    const isOnline = networkInterfaces.some(networkInterface => {
      return minimatch(networkInterface.address, this.#address);
    });

    return isOnline ? NetworkStatus.online : NetworkStatus.offline;
  }

  private init(): NodeJS.Timer {
    return setInterval(() => {
      const newStatus = this.findStatus();

      if (newStatus !== this.#status) {
        this.#status = newStatus;
        this.dispatchEvents();
      }
    }, this.#interval);
  }

  private dispatchEvents(): void {
    this.emit('change', { status: this.#status });

    if (this.#status === NetworkStatus.online) {
      this.emit('online', {});
    } else {
      this.emit('offline', {});
    }
  }
}

export interface NetworkOptions {
  address: string;
  interval?: DurationString | number | undefined;
}

export enum NetworkStatus {
  online = 'online',
  offline = 'offline',
}

export interface NetworkEventMap {
  change: { status: NetworkStatus };
  online: {};
  offline: {};
}
