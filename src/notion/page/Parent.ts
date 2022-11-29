import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export class Parent {
  id: string | undefined;
  type: ParentType;

  constructor(parent: PageObjectResponse['parent']) {
    switch (parent.type) {
      case 'block_id':
        this.id = parent.block_id;
        this.type = 'block';
        break;

      case 'database_id':
        this.id = parent.database_id;
        this.type = 'database';
        break;

      case 'page_id':
        this.id = parent.page_id;
        this.type = 'page';
        break;

      case 'workspace':
        this.type = 'workspace';
        break;
    }
  }
}

export type ParentType = 'database' | 'page' | 'block' | 'workspace';
