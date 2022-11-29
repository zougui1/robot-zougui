import { z } from 'zod';

import { Option } from '../../discord';

const contents = ['Art', 'Story', 'Imagination', 'RP'] as const;

export const contentOption = new Option('[content]')
  .description('The content type you fapped to')
  .schema(z.enum(contents).default('Art'))
  .autocomplete(({ value }) => {
    const valueLower = value.toLowerCase();

    return contents
      .filter(content => content.toLowerCase().includes(valueLower))
      .map(value => ({ value, name: value }));
  });
