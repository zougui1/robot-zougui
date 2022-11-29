import { z } from 'zod';

import { ShowService } from './show.service';
import { Option } from '../../discord';


export const createNameOption = ({ watching }: CreateNameOptionOptions): Option<'<name>', z.ZodString, void> => {
  return new Option('<name>')
    .description(`Name of the show you are ${watching ? '' : 'not '}currently watching`)
    .autocomplete(async ({ value }) => {
      const service = new ShowService();
      const showNames = await service.findMatchingShowNames({ name: value, watching });

      return showNames;
    });
}

export interface CreateNameOptionOptions {
  watching: boolean;
}
