import { z } from 'zod';

import { StoryService } from './story.service';
import { Option } from '../../discord';


export const createNameOption = ({ reading }: CreateNameOptionOptions): Option<'<name>', z.ZodString, void> => {
  return new Option('<name>')
    .description(`Name of the story you are ${reading ? '' : 'not '}currently reading`)
    .autocomplete(async ({ value }) => {
      const service = new StoryService();
      const storyNames = await service.findMatchingStoryNames({ name: value, reading });

      return storyNames;
    });
}

export interface CreateNameOptionOptions {
  reading: boolean;
}
