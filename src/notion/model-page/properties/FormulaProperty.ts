import { DateTime } from 'luxon';

import { FormulaRawProperty, DateFormulaPropertyRawResponse } from '../../page';
import { ModelProperty } from '../types';
import { FormulaPropertyResponse, DateFormulaPropertyResponse } from '../property-types';

export class FormulaProperty implements ModelProperty<'formula'> {
  static readonly type: 'formula' = 'formula';

  id: string;
  type: 'formula';
  formula: FormulaPropertyResponse;

  constructor(property: FormulaRawProperty) {
    this.id = property.id;
    this.type = property.type;

    if (property.formula.type === 'date') {
      this.formula = convertDateFormula(property.formula);
    } else {
      this.formula = { ...property.formula };
    }
  }
}

const convertDateFormula = (formula: DateFormulaPropertyRawResponse): DateFormulaPropertyResponse => {
  if (!formula.date) {
    return { type: formula.type, date: null }
  }

  return {
    type: formula.type,
    date: {
      start: DateTime.fromISO(formula.date.start),
      end: formula.date.end ? DateTime.fromISO(formula.date.end) : null,
      timeZone: formula.date.time_zone,
    },
  };
}
