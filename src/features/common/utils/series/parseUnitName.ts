import { safeSplit } from '../../../../utils';

const reIndex = /^[a-z][0-9]+$/i;
const reUnitNameSeparators = /[;:]/;

/**
 * potential name formats:
 * - {unitName}
 * - {seriesName}; [A-Z]{unitIndex}
 * - {seriesName}; [A-Z]{unitIndex}: {unitName}
 */
export const parseUnitName = (name: string, text: string): string | undefined => {
  const [
    seriesOrUnitName,
    dirtyIndexOrName,
    maybeUnitName,
  ] = safeSplit(text, reUnitNameSeparators, 3);

  if (maybeUnitName?.trim()) {
    return maybeUnitName;
  }

  const indexOrName = dirtyIndexOrName?.trim();

  if (indexOrName && !reIndex.test(indexOrName)) {
    return indexOrName;
  }

  if (!seriesOrUnitName.includes(name)) {
    return seriesOrUnitName;
  }
}
