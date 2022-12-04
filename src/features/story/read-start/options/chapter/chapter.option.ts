import { ReadStartService } from '../../read-start.service';
import { findUnitsSuggestions } from '../../../../common/utils';
import { Option } from '../../../../../discord';
import { parseListableNumber } from '../../../../../utils';

export const chaptersOption = new Option('[chapters]')
  .description('Choose the chapters you are going to read')
  .autocomplete(async ({ value, interaction }) => {
    const storyName = interaction.options.getString('name', true);
    const service = new ReadStartService();
    const chapters = await service.findNotReadingChapters({ name: storyName });

    return findUnitsSuggestions(chapters, {
      search: value,
      seriesName: storyName,
      label: {
        singular: 'Chapter',
        plural: 'Chapters',
      },
      addUnitNameToSuggestions: true,
      getUnitNumber: chapter => chapter.properties.Index.number,
      getUnitName: chapter => chapter.properties.Name.text,
    });
  })
  .addTransform(arg => arg ? parseListableNumber(arg, { strict: true }) : []);
