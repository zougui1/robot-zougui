import { DateTime } from 'luxon';

import { CreatedTimeRawProperty } from '../../page';
import { ModelProperty } from '../types';

export class CreatedTimeProperty implements ModelProperty<'created_time'> {
  static readonly type: 'created_time' = 'created_time';

  id: string;
  type: 'created_time';
  createdTime: DateTime;

  constructor(property: CreatedTimeRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.createdTime = DateTime.fromISO(property.created_time);
  }
}
