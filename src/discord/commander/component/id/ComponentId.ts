import YAML from 'yaml';
import lzString from 'lz-string';

const nameAlias = 'n';

export class ComponentId {
  static encode(data: Record<string, unknown>): string {
    return lzString.compressToUTF16(YAML.stringify(data));
  }

  static decode(id: string): Record<string, unknown> {
    const decompressedId = lzString.decompressFromUTF16(id);

    if (!decompressedId) {
      throw new Error('Decompression failed');
    }

    const data = YAML.parse(decompressedId);

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid decoded data');
    }

    return data;
  }

  static getNameFromAlias(data: Record<string, unknown>): string | undefined {
    if (nameAlias in data && typeof data[nameAlias] === 'string') {
      return data[nameAlias];
    }
  }
}
