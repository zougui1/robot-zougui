import { DateTime } from 'luxon';
import { PageObjectResponse, PartialUserObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { getModelProperties } from './getModelProperties';
import { PropsSchema, ModelProps } from './types';
import { Page, Cover, Icon, Parent } from '../page';

export abstract class ModelPage<Props extends PropsSchema> {
  archived: boolean;
  cover: Cover | null;
  createdBy: PartialUserObjectResponse;
  createdTime: DateTime;
  icon: Icon | null;
  id: string;
  lastEditedBy: PartialUserObjectResponse;
  lastEditedTime: DateTime;
  parent: Parent;
  properties: ModelProps<Props>;
  url: string;

  constructor(page: PageObjectResponse, options: ModelPageOptions<Props>);
  constructor(page: Page, options: ModelPageOptions<Props>);
  constructor(pageOrPageObject: Page | PageObjectResponse, options: ModelPageOptions<Props>) {
    const page = pageOrPageObject instanceof Page ? pageOrPageObject : new Page(pageOrPageObject);

    this.archived = page.archived;
    this.cover = page.cover;
    this.createdBy = page.createdBy;
    this.createdTime = page.createdTime;
    this.icon = page.icon;
    this.id = page.id;
    this.lastEditedBy = page.lastEditedBy;
    this.lastEditedTime = page.lastEditedTime;
    this.parent = page.parent;
    this.properties = getModelProperties(page.properties, options.properties);
    this.url = page.url;
  }
}

export interface ModelPageOptions<Props extends PropsSchema> {
  properties: Props;
}
