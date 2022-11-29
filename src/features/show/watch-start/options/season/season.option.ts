import { Service } from '../../watch-start.service';
import { findUnitsSuggestions } from '../../../../common/utils';
import { Option } from '../../../../../discord';
import { parseListableNumber } from '../../../../../utils';

export const seasonsOption = new Option('[seasons]')
  .description('Choose the seasons you are going to watch')
  .autocomplete(async ({ value, interaction }) => {
    const showName = interaction.options.getString('name', true);
    const service = new Service();
    const seasons = await service.findSeasons({ name: showName });

    return findUnitsSuggestions(seasons, {
      search: value,
      seriesName: showName,
      label: {
        singular: 'Season',
        plural: 'Seasons',
      },
      getUnitNumber: season => season.properties.Index.number,
      getUnitName: season => season.properties.Name.text,
    });
  })
  .addTransform(arg => arg ? parseListableNumber(arg, { strict: true }) : []);
