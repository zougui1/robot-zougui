const reIndex = /^[a-z][0-9]+$/i;
const reUnitNameSeparators = /[;:]/;

/**
 * potential name formats:
 * - {unitName}
 * - {seriesName}; [A-Z]{unitIndex}
 * - {seriesName}; [A-Z]{unitIndex}: {unitName}
 * - {seriesName}: {unitName}; [A-Z]{unitIndex}
 */
export const parseUnitName = (name: string, text: string): string | undefined => {
  const parts = text.split(reUnitNameSeparators);

  return parts.find(part => {
    part = part.trim();
    return part && !reIndex.test(part) && !part.includes(name);
  });
}
