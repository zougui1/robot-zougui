import { login } from 'furaffinity-api';

import {
  getSafeFuraffinityUrl,
  isFuraffinityUrl,
  getSafeFuraffinityId,
} from './utils';

export class Furaffinity {
  static #loggedIn: boolean = false;

  static login(cookieA: string, cookieB: string): void {
    if (this.#loggedIn) {
      return;
    }

    login(cookieA, cookieB);
    this.#loggedIn = true;
  }

  static checkIsLoggedIn(): void {
    if (!this.#loggedIn) {
      throw new Error('You cannot query furaffinity without logging in first. Use Furaffinity.login(cookieA, cookieB)');
    }
  }

  static getSafeUrl(unsafeUrl: string): string {
    return getSafeFuraffinityUrl(unsafeUrl);
  }

  static isValidUrl(url: string): boolean {
    return isFuraffinityUrl(url);
  }

  static getSafeId(unsafeId: string): string {
    return getSafeFuraffinityId(unsafeId);
  }
}
