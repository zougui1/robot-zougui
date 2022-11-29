import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Constructor } from 'type-fest';

import { ModelPage } from './ModelPage';
import { PropsSchema } from './types';

export const createModel = <Props extends PropsSchema>(options: CreateModelOptions<Props>): Constructor<ModelPage<Props>, [page: PageObjectResponse]> => {
  return class Model extends ModelPage<Props> {
    constructor(page: PageObjectResponse) {
      super(page, options);
    }
  }
}

export interface CreateModelOptions<Props extends PropsSchema> {
  properties: Props;
}
