import _ from 'radash';

const reNumber = /[0-9]+(\.[0-9]*)?/;

export const matchNumber = (str: string): number | undefined => {
  const match = str.match(reNumber);
  const number = Number(match?.[0]);

  if (_.isNumber(number)) {
    return number;
  }
}

export const tryStringifyRange = (numbers: number[]): string | undefined => {
  if (numbers.length < 2) {
    return;
  }

  const sortedNumbers = _.sort(numbers, num => num);
  const isSuite = sortedNumbers.slice(1).every((num, index) => num === (sortedNumbers[index] + 1));

  if (isSuite) {
    const min = Math.min(...sortedNumbers);
    const max = Math.max(...sortedNumbers);

    return `${min} to ${max}`;
  }
}
