import {
  getIsSoFurryUrl,
  getSafeSoFurryUrl,
} from './utils';

export class SoFurry {
  static getSafeUrl(unsafeUrl: string): string {
    return getSafeSoFurryUrl(unsafeUrl);
  }

  static isValidUrl(url: string): boolean {
    return getIsSoFurryUrl(url);
  }
}
