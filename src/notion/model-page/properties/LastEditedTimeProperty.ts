import { DateTime } from 'luxon';

import { LastEditedTimeRawProperty } from '../../page';
import { ModelProperty } from '../types';

export class LastEditedTimeProperty implements ModelProperty<'last_edited_time'> {
  static readonly type: 'last_edited_time' = 'last_edited_time';

  id: string;
  type: 'last_edited_time';
  lastEditedTime: DateTime;

  constructor(property: LastEditedTimeRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.lastEditedTime = DateTime.fromISO(property.last_edited_time);
  }
}
