import { UserObjectResponse, PartialUserObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { PeopleRawProperty } from '../../page';
import { ModelProperty } from '../types';

export class PeopleProperty implements ModelProperty<'people'> {
  static readonly type: 'people' = 'people';

  id: string;
  type: 'people';
  people: (PartialUserObjectResponse | UserObjectResponse)[];

  constructor(property: PeopleRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.people = [...property.people];
  }
}
