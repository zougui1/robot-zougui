import { UserObjectResponse, PartialUserObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { LastEditedByRawProperty } from '../../page';
import { ModelProperty } from '../types';

export class LastEditedByProperty implements ModelProperty<'last_edited_by'> {
  static readonly type: 'last_edited_by' = 'last_edited_by';

  id: string;
  type: 'last_edited_by';
  lastEditedBy: PartialUserObjectResponse | UserObjectResponse;

  constructor(property: LastEditedByRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.lastEditedBy = property.last_edited_by;
  }
}
