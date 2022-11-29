import { isFullPage } from '@notionhq/client';
import { PartialPageObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Constructor } from 'type-fest';

import { Page } from '../page';
import { ModelPage } from '../model-page';
import { compact } from '../../utils';

export function getFullPageList(pages: (PartialPageObjectResponse | PageObjectResponse)[]): Page[]
export function getFullPageList<Model extends ModelPage<any>>(pages: (PartialPageObjectResponse | PageObjectResponse)[], model: Constructor<Model>): Model[]
export function getFullPageList<Model extends ModelPage<any>>(pages: (PartialPageObjectResponse | PageObjectResponse)[], maybeModel?: Constructor<Model> | undefined): (Model | Page)[] {
  const PageOrModelPage = maybeModel || Page;

  const pageList = pages.map(page => {
    return isFullPage(page) ? new PageOrModelPage(page) : undefined;
  });

  return compact(pageList);
}
