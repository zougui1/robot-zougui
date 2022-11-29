import { UrlRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';

export class NullableUrlProperty implements ModelProperty<'url'> {
  static readonly type: 'url' = 'url';

  id: string;
  type: 'url';
  url: string | null;

  constructor(property: UrlRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.url = property.url;
  }
}

export class UrlProperty implements ModelProperty<'url'> {
  static readonly type: 'url' = 'url';
  static readonly Nullable = NullableUrlProperty;

  id: string;
  type: 'url';
  url: string;

  constructor(property: UrlRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    if (property.url == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.url = property.url;
  }
}

export namespace UrlProperty {
  export type Nullable = NullableUrlProperty;
}
