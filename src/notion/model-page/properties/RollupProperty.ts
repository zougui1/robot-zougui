import { DateTime } from 'luxon';

import { RollupRawProperty, DateRollupRawResponse } from '../../page';
import { ModelProperty } from '../types';
import { RollupResponse, DateRollupResponse } from '../property-types';

export class RollupProperty implements ModelProperty<'rollup'> {
  static readonly type: 'rollup' = 'rollup';

  id: string;
  type: 'rollup';
  rollup: RollupResponse;

  constructor(property: RollupRawProperty) {
    this.id = property.id;
    this.type = property.type;

    if (property.rollup.type === 'date') {
      this.rollup = convertDateRollup(property.rollup);
    } else {
      this.rollup = { ...property.rollup };
    }
  }
}

const convertDateRollup = (rollup: DateRollupRawResponse): DateRollupResponse => {
  const partialRollup = {
    type: rollup.type,
    function: rollup.function,
  };

  if (!rollup.date) {
    return { ...partialRollup, date: null }
  }

  return {
    ...partialRollup,
    date: {
      start: DateTime.fromISO(rollup.date.start),
      end: rollup.date.end ? DateTime.fromISO(rollup.date.end) : null,
      timeZone: rollup.date.time_zone,
    },
  };
}
