import { MultiSelectRawProperty } from '../../page';
import { ModelProperty } from '../types';
import { SelectPropertyResponse } from '../property-types';

export class MultiSelectProperty implements ModelProperty<'multi_select'> {
  static readonly type: 'multi_select' = 'multi_select';

  id: string;
  type: 'multi_select';
  selects: SelectPropertyResponse[];

  constructor(property: MultiSelectRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.selects = property.multi_select.map(select => ({ ...select }));
  }
}
