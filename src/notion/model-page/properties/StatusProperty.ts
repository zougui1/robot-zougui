import { StatusRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';
import { SelectPropertyResponse } from '../property-types';

export class NullableStatusProperty implements ModelProperty<'status'> {
  static readonly type: 'status' = 'status';

  id: string;
  type: 'status';
  /**
   * alias for `status.name`
   */
  name: string | null;
  status: SelectPropertyResponse | null;

  constructor(property: StatusRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.name = property.status?.name ?? null;
    this.status = property.status;
  }
}

export class StatusProperty implements ModelProperty<'status'> {
  static readonly type: 'status' = 'status';
  static readonly Nullable = NullableStatusProperty;

  id: string;
  type: 'status';
  /**
   * alias for `status.name`
   */
  name: string;
  status: SelectPropertyResponse;

  constructor(property: StatusRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.status == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.status = property.status;
    this.name = property.status.name;
  }
}

export namespace StatusProperty {
  export type Nullable = NullableStatusProperty;
}
