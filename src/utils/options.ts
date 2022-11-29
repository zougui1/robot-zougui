import { compact } from './array';

export const createListOption = (label: string, userInputNumbers: number[], availableNumbers: number[]): Option => {
  if (!userInputNumbers.length) {
    return { name: `${label} 1, 2`, value: '1, 2' };
  }

  const maxUserInputSeason = Math.max(...userInputNumbers);
  const nexSeasonIndex = availableNumbers.find(databaseSeason => {
    return databaseSeason === (maxUserInputSeason + 1);
  });

  const indexesWithNextSeason = compact([...userInputNumbers, nexSeasonIndex]).join(', ');

  return {
    name: `${label} ${indexesWithNextSeason}`,
    value: indexesWithNextSeason,
  };
}

export const createRangeOption = (label: string, userInputNumbers: number[], availableNumbers: number[]): Option => {
  // add 2 to make sure the last season is greater than 1
  const lastSeasonIndex = Math.max(...availableNumbers);
  const minSeason = userInputNumbers.length
    ? Math.min(...userInputNumbers)
    : 1;

  return {
    name: `${label} ${minSeason} to ${lastSeasonIndex}`,
    value: `${minSeason}-${lastSeasonIndex}`,
  };
}

export const createListableOptions = (label: string, userInputNumbers: number[], availableNumbers: number[]): [list: Option, range: Option] => {
  return [
    createListOption(label, userInputNumbers, availableNumbers),
    createRangeOption(label, userInputNumbers, availableNumbers),
  ];
}

type Option = {
  name: string;
  value: string;
}
