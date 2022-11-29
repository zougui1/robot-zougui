import { ModelPage } from '../notion';

export const filterPagesByNumbers = <T extends ModelPage<any>>(pages: T[], numbers: number[], predicate: (page: T) => number): T[] => {
  if (!numbers.length) {
    return pages;
  }

  return pages.filter(page => numbers.includes(predicate(page)));
}
