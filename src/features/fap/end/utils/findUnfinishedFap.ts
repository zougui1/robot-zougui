import { Fap } from '../../fap.model';

export const findUnfinishedFap = (faps: Fap.Instance[]): Fap.Instance | undefined => {
  const unfinishedFapping = faps.find(fap => {
    // if, for some reason, an entry has no start date then we ignore it
    return fap.properties.Date?.start && !fap.properties.Date?.end;
  });

  return unfinishedFapping;
}
