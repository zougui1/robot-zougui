import { ReadStartService } from '../../read-start.service';
import { findChapterSuggestions } from '../../../utils';
import { Option } from '../../../../../discord';
import { parseListableNumber } from '../../../../../utils';

export const chaptersOption = new Option('[chapters]')
  .description('Choose the chapters you are going to read')
  .autocomplete(async ({ value, interaction }) => {
    const storyName = interaction.options.getString('name', true);
    const service = new ReadStartService();
    const chapters = await service.findNotReadingChapters({ name: storyName });

    return findChapterSuggestions({
      chapters,
      storyName,
      search: value,
    });
  })
  .addTransform(arg => arg ? parseListableNumber(arg, { strict: true }) : []);
