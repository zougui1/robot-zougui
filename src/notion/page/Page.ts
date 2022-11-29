import { DateTime } from 'luxon';
import { PageObjectResponse, PartialUserObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Cover } from './Cover';
import { Icon } from './Icon';
import { Parent } from './Parent';
import { Properties } from './Properties';

export class Page {
  archived: boolean;
  cover: Cover | null;
  createdBy: PartialUserObjectResponse;
  createdTime: DateTime;
  icon: Icon | null;
  id: string;
  lastEditedBy: PartialUserObjectResponse;
  lastEditedTime: DateTime;
  parent: Parent;
  properties: Properties;
  url: string;

  constructor(page: PageObjectResponse) {
    this.archived = page.archived;
    this.cover = page.cover && new Cover(page.cover);
    this.createdBy = page.created_by;
    this.createdTime = DateTime.fromISO(page.created_time);
    this.icon = page.icon && new Icon(page.icon);
    this.id = page.id;
    this.lastEditedBy = page.last_edited_by;
    this.lastEditedTime = DateTime.fromISO(page.last_edited_time);
    this.parent = new Parent(page.parent);
    this.properties = new Properties(page.properties);
    this.url = page.url;
  }
}
