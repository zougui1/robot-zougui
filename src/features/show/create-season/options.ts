import { z } from 'zod';

import { CreateSeasonService } from './create-season.service';
import { ShowSource } from '../enums';
import { Option } from '../../../discord';

const sources = [
  ShowSource.Netflix,
  ShowSource.AmazonVideo,
  ShowSource.Crunchyroll,
  ShowSource.Wcostream,
] as const;

export const sourceOption = new Option('[source]')
  .description('Source of the show')
  .schema(z.enum(sources))
  .autocomplete(({ value }) => {
    const valueLower = value.toLowerCase();

    return sources.filter(source => source.toLowerCase().includes(valueLower));
  });

export const nameOption = new Option('<name>')
  .description('Name of the show')
  .autocomplete(async ({ value }) => {
    const service = new CreateSeasonService();
    return await service.findMatchingShowNames({ name: value });
  });
