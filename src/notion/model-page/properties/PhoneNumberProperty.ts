import { PhoneNumberRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';

export class NullablePhoneNumberProperty implements ModelProperty<'phone_number'> {
  static readonly type: 'phone_number' = 'phone_number';

  id: string;
  type: 'phone_number';
  phoneNumber: string | null;

  constructor(property: PhoneNumberRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.phoneNumber = property.phone_number;
  }
}

export class PhoneNumberProperty implements ModelProperty<'phone_number'> {
  static readonly type: 'phone_number' = 'phone_number';
  static readonly Nullable = NullablePhoneNumberProperty;

  id: string;
  type: 'phone_number';
  phoneNumber: string;

  constructor(property: PhoneNumberRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.phone_number == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.phoneNumber = property.phone_number;
  }
}

export namespace PhoneNumberProperty {
  export type Nullable = NullablePhoneNumberProperty;
}
