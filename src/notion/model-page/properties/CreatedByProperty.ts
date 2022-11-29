import { UserObjectResponse, PartialUserObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { CreatedByRawProperty } from '../../page';
import { ModelProperty } from '../types';

export class CreatedByProperty implements ModelProperty<'created_by'> {
  static readonly type: 'created_by' = 'created_by';

  id: string;
  type: 'created_by';
  createdBy: PartialUserObjectResponse | UserObjectResponse;

  constructor(property: CreatedByRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.createdBy = property.created_by;
  }
}
