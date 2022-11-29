import { NumberRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';

export class NullableNumberProperty implements ModelProperty<'number'> {
  static readonly type: 'number' = 'number';

  id: string;
  type: 'number';
  number: number | null;

  constructor(property: NumberRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.number = property.number;
  }
}

export class NumberProperty implements ModelProperty<'number'> {
  static readonly type: 'number' = 'number';
  static readonly Nullable = NullableNumberProperty;

  id: string;
  type: 'number';
  number: number;

  constructor(property: NumberRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.number == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.number = property.number;
  }
}

export namespace NumberProperty {
  export type Nullable = NullableNumberProperty;
}
