const reNumbers = /[0-9]+/g;

export const parseEpisodesDurations = (str: string): number[] => {
  const numbers = str.matchAll(reNumbers);
  return [...numbers].map(Number);
}
