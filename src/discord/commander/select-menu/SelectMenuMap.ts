import YAML from 'yaml';
import lzString from 'lz-string';

import type { SelectMenu } from './SelectMenu';

export class SelectMenuMap {
  readonly menus: Record<string, SelectMenu<any>> = {};

  add(menu: SelectMenu<any>): this {
    this.menus[menu.name] = menu;
    return this;
  }

  get(name: string): { menu: SelectMenu<any>; payload: any } | undefined {
    try {
      const decompressedName = lzString.decompressFromUTF16(name);

      if (!decompressedName) {
        return;
      }

      const payload = YAML.parse(decompressedName);

      const menu = this.menus[payload.n];

      if (menu) {
        return { menu, payload };
      }
    } catch {}
  }

  destroy(): void {
    for (const menu of Object.values(this.menus)) {
      menu.destroy();
    }
  }
}
