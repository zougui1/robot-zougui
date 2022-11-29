import { ModelPage } from '../../../../notion';

export const createSingleUnitSuggestions = <T extends ModelPage<any>>(units: T[], options: CreateSingleUnitSuggestionsOptions<T>): Suggestion[] => {
  const { label, getIndex, getName } = options;

  const unitSuggestions = units.map(unit => {
    const number = getIndex(unit);
    const maybeName = getName?.(unit);
    const name = maybeName ? `${number}: ${maybeName}` : number;

    return {
      name: `${label} ${name}`,
      value: String(number),
    };
  });

  return unitSuggestions;
}

export interface CreateSingleUnitSuggestionsOptions<T extends ModelPage<any>> {
  label: string;
  getIndex: (unit: T) => number;
  getName?: ((unit: T) => string | undefined) | undefined;
}

type Suggestion = {
  name: string;
  value: string;
}
