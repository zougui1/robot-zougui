import { Page } from '../page';
import { ModelPage } from '../model-page';
import { Exception } from '../../error';

export const getOnePage = <T extends Page | ModelPage<any>>(pages: T[], options: GetOnePageOptions<T>): T => {
  const hasNoPage = !pages.length;

  if (hasNoPage || pages.length > 1) {
    const { code, message } = hasNoPage ? options.notFound : options.notUnique;
    throw new Exception(message(pages), { code });
  }

  return pages[0];
}

export interface GetOnePageOptions<T extends Page | ModelPage<any>> {
  notFound: ErrorData<T>;
  notUnique: ErrorData<T>;
}

type ErrorData<T extends Page | ModelPage<any>> = {
  code: string;
  message: (pages: T[]) => string;
}
