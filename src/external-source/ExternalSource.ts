import { Furaffinity } from '../furaffinity';
import { SoFurry } from '../sofurry';

export class ExternalSource {
  static isValidUrl(url: string): boolean {
    return Furaffinity.isValidUrl(url) || SoFurry.isValidUrl(url);
  }
}
