import { z } from 'zod';

import { FapContentType } from './FapContentType';
import { Option } from '../../discord';

const contents = [
  FapContentType.Art,
  FapContentType.Story,
  FapContentType.Imagination,
  FapContentType.RP,
] as const;

export const contentOption = new Option('[content]')
  .description('The content type you fapped to')
  .schema(z.enum(contents).default(FapContentType.Art))
  .autocomplete(({ value }) => {
    const valueLower = value.toLowerCase();

    return contents
      .filter(content => content.toLowerCase().includes(valueLower))
      .map(value => ({ value, name: value }));
  });
