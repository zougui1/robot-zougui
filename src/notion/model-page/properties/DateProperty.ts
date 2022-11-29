import { DateTime } from 'luxon';

import { DateRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';
import { TimeZoneRequest } from '../../types';

export class NullableDateProperty implements ModelProperty<'date'> {
  static readonly type: 'date' = 'date';

  id: string;
  type: 'date';
  start: DateTime | null;
  end: DateTime | null;
  timeZone: TimeZoneRequest | null;

  constructor(property: DateRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.start = property.date?.start ? DateTime.fromISO(property.date.start) : null;
    this.end = property.date?.end ? DateTime.fromISO(property.date.end) : null;
    this.timeZone = property.date?.time_zone ?? null;
  }
}

export class DateProperty implements ModelProperty<'date'> {
  static readonly type: 'date' = 'date';
  static readonly Nullable = NullableDateProperty;

  id: string;
  type: 'date';
  start: DateTime;
  end: DateTime | null;
  timeZone: TimeZoneRequest | null;

  constructor(property: DateRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.date == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.start = DateTime.fromISO(property.date.start);
    this.end = property.date?.end ? DateTime.fromISO(property.date.end) : null;
    this.timeZone = property.date?.time_zone ?? null;
  }
}

export namespace DateProperty {
  export type Nullable = NullableDateProperty;
}
