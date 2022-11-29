import _ from 'radash';

export class EphemeralCache<T> {
  #timeout: number;
  #value: T | undefined;
  #dependencies: unknown[] = []

  constructor(options: EphemeralCacheOptions) {
    this.#timeout = options.timeout;
  }

  getValue(getValue: () => T, dependencies: unknown[]): T {
    if (this.#value !== undefined && _.isEqual(this.#dependencies, dependencies)) {
      return this.#value;
    }

    this.#value = getValue();
    // copy just in case the reference gets edited
    this.#dependencies = [...dependencies];

    setTimeout(() => {
      this.#value = undefined;
      this.#dependencies = [];
    }, this.#timeout);

    return this.#value;
  }

  call<Args extends any[]>(func: (...args: Args) => T, ...args: Args): T {
    return this.getValue(() => func(...args), args);
  }

  wrap<Args extends any[]>(func: (...args: Args) => T): ((...args: Args) => T) {
    return (...args: Args) => this.call(func, ...args);
  }
}

export interface EphemeralCacheOptions {
  timeout: number;
}
