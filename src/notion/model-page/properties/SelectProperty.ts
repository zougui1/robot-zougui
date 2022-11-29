import { SelectRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';
import { SelectPropertyResponse } from '../property-types';

export class NullableSelectProperty implements ModelProperty<'select'> {
  static readonly type: 'select' = 'select';

  id: string;
  type: 'select';
  /**
   * alias for `select.name`
   */
  name: string | null;
  select: SelectPropertyResponse | null;

  constructor(property: SelectRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.name = property.select?.name ?? null;
    this.select = property.select;
  }
}

export class SelectProperty implements ModelProperty<'select'> {
  static readonly type: 'select' = 'select';
  static readonly Nullable = NullableSelectProperty;

  id: string;
  type: 'select';
  /**
   * alias for `select.name`
   */
  name: string;
  select: SelectPropertyResponse;

  constructor(property: SelectRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.select == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.select = {...property.select};
    this.name = property.select.name;
  }
}

export namespace SelectProperty {
  export type Nullable = NullableSelectProperty;
}
