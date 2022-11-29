import _ from 'radash';

import { compact, range } from './array';
import { matchNumber } from './number';

export const parseRange = (rangeString: string, options?: ParseRangeOptions | undefined): number[] => {
  const numbers = rangeString.split('-', 2).map(matchNumber);
  const [min, max] = compact(numbers);

  if (!min || !max) {
    if (!options?.strict) {
      return [];
    }

    throw new Error(`Could not find a valid range of numbers in "${rangeString}"`);
  }

  return range(min, max + 1);
}

export interface ParseRangeOptions {
  strict?: boolean | undefined;
}

export const parseNumberList = (list: string, options?: ParseNumberListOptions | undefined): number[] => {
  const numbers = list
    .split(',')
    .filter(part => part.trim())
    .map(part => {
      return {
        value: matchNumber(part),
        raw: part,
      };
    });
  const invalidNumbers = numbers.filter(number => !_.isNumber(number.value));

  if (invalidNumbers.length) {
    if (!options ?.strict) {
      return [];
    }

    if (numbers.length === 1) {
      throw new Error(`Could not find a valid number in "${list}"`);
    }

    const invalidValues = invalidNumbers.map(number => `"${number.raw}"`);
    throw new Error(`Invalid list of numbers provided: "${list}". The following values are not valid numbers: ${invalidValues}`);
  }

  return compact(numbers.map(number => number.value));
}

export interface ParseNumberListOptions {
  strict?: boolean | undefined;
}

export const parseListableNumber = (text: string, options?: ParseListableNumberOptions | undefined): number[] => {
  if (text.includes('-')) {
    return parseRange(text, options);
  }

  return parseNumberList(text, options);
}

export interface ParseListableNumberOptions {
  strict?: boolean | undefined;
}
