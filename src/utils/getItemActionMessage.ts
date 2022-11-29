import { tryStringifyRange } from './number';

export const getItemActionMessage = (options: GetItemActionMessageOptions): string => {
  const { itemName, numbers, actionLabel, itemLabels } = options;

  if (!numbers.length) {
    return `${actionLabel} "${itemName}"`;
  }

  const range = tryStringifyRange(numbers);

  if (range) {
    return `${actionLabel} the chapters ${range} of "${itemName}"`;
  }

  const pluralizedChapter = numbers.length > 1
    ? itemLabels.plural
    : itemLabels.singular;
  const chapterNumbersJoined = numbers.join(', ');

  return `${actionLabel} the ${pluralizedChapter} ${chapterNumbersJoined} of "${itemName}"`;
}

export interface GetItemActionMessageOptions {
  itemName: string;
  numbers: number[];
  actionLabel: string;
  itemLabels: {
    singular: string;
    plural: string;
  };
}
