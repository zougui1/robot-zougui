import { EmailRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';

export class NullableEmailProperty implements ModelProperty<'email'> {
  static readonly type: 'email' = 'email';

  id: string;
  type: 'email';
  email: string | null;

  constructor(property: EmailRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.email = property.email;
  }
}

export class EmailProperty implements ModelProperty<'email'> {
  static readonly type: 'email' = 'email';
  static readonly Nullable = NullableEmailProperty;

  id: string;
  type: 'email';
  email: string;

  constructor(property: EmailRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.email == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.email = property.email;
  }
}

export namespace EmailProperty {
  export type Nullable = NullableEmailProperty;
}
