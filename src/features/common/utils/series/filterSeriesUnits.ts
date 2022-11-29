import { ModelPage } from '../../../../notion';

const reWhitespaces = / +/g;

export const filterSeriesUnits = <T extends ModelPage<any>>(units: T[], options: FilterSeriesUnitsOptions<T>): T[] => {
  const { unitsNumbers: inputUnitsNumbers, getUnitNumber, getUnitName } = options;
  const search = options.search
    .trim()
    .toLowerCase()
    .replace(reWhitespaces, ' ');

  if (!search.trim()) {
    return units;
  }

  const isNewEntry = search.endsWith(',');

  if (isNewEntry) {
    return units.filter(unit => {
      return !inputUnitsNumbers.includes(getUnitNumber(unit));
    });
  }

  return units.filter(unit => {
    const unitNumber = getUnitNumber(unit);
    const unitNumberString = String(unitNumber);

    const doesUnitNumberMatch = inputUnitsNumbers.some((inputUnitNumber, index) => {
      const isLast = index === (inputUnitsNumbers.length - 1);

      // the value must be different than the unit number
      // and must include it, to match '1x' with the unit number '1'
      // but not '1' with the unit number '1'
      return (
        (
          // if it is the entry the user is currently typing
          // then we allow it the current number in the list of option
          // unless it has already been entered
          unitNumber !== inputUnitNumber ||
          (isLast && inputUnitsNumbers.indexOf(inputUnitNumber) === index)
        ) &&
        unitNumberString.includes(String(inputUnitNumber))
      );
    });

    if (doesUnitNumberMatch) {
      return true;
    }

    return getUnitName(unit).toLowerCase().includes(search);
  });
}

export interface FilterSeriesUnitsOptions<T extends ModelPage<any>> {
  search: string;
  unitsNumbers: number[];
  getUnitNumber: (unit: T) => number;
  getUnitName: (unit: T) => string;
}
