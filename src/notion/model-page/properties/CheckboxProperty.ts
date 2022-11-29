import { CheckboxRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';

export class NullableCheckboxProperty implements ModelProperty<'checkbox'> {
  static readonly type: 'checkbox' = 'checkbox';

  id: string;
  type: 'checkbox';
  checkbox: boolean | null;

  constructor(property: CheckboxRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.checkbox = property.checkbox;
  }
}

export class CheckboxProperty implements ModelProperty<'checkbox'> {
  static readonly type: 'checkbox' = 'checkbox';
  static readonly Nullable = NullableCheckboxProperty;

  id: string;
  type: 'checkbox';
  checkbox: boolean;

  constructor(property: CheckboxRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.checkbox == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.checkbox = property.checkbox;
  }
}

export namespace CheckboxProperty {
  export type Nullable = NullableCheckboxProperty;
}
