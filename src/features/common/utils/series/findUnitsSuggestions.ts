import { createUnitsSuggestions } from './createUnitsSuggestions';
import { filterSeriesUnits } from './filterSeriesUnits';
import { parseUnitName } from './parseUnitName';
import { ModelPage } from '../../../../notion';
import { parseListableNumber } from '../../../../utils';

export const findUnitsSuggestions = <T extends ModelPage<any>>(units: T[], options: FindUnitsSuggestionsOptions<T>): Suggestion[] => {
  const { search, seriesName, label, getUnitNumber, getUnitName } = options;

  const inputUnitsNumbers = parseListableNumber(search, { strict: false });
  const filteredChapters = filterSeriesUnits(units, {
    search,
    unitsNumbers: inputUnitsNumbers,
    getUnitNumber,
    getUnitName,
  });

  const chaptersOptions = createUnitsSuggestions(filteredChapters, {
    allUnits: units,
    inputNumbers: inputUnitsNumbers,
    label,
    getIndex: getUnitNumber,
    getName: options.addUnitNameToSuggestions
      ? unit => parseUnitName(seriesName, getUnitName(unit))
      : undefined,
  });

  return chaptersOptions;
}

export interface FindUnitsSuggestionsOptions<T extends ModelPage<any>> {
  search: string;
  seriesName: string;
  addUnitNameToSuggestions?: boolean | undefined;
  label: {
    singular: string;
    plural: string;
  };
  getUnitNumber: (unit: T) => number;
  getUnitName: (unit: T) => string;
}

type Suggestion = {
  name: string;
  value: string;
}
