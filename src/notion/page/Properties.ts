import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { RawProperty } from './Property';
import { PropertyType } from './property-types';

export class Properties {
  properties: Record<string, RawProperty> = {};

  constructor(properties: PageObjectResponse['properties']) {
    for (const [key, property] of Object.entries(properties)) {
      this.properties[key] = new RawProperty(property);
    }
  }

  get(name: string, required: true): RawProperty;
  get(name: string, required?: boolean | undefined): RawProperty | undefined;
  get(name: string, required?: boolean | undefined): RawProperty | undefined {
    const property = this.properties[name];

    if (required && !property) {
      throw new Error(`No property "${name}" found`);
    }

    return property;
  }

  getAs<Type extends PropertyType>(name: string, type: Type, required: true): RawProperty<Type>;
  getAs<Type extends PropertyType>(name: string, type: Type, required?: boolean | undefined): RawProperty<Type> | undefined;
  getAs<Type extends PropertyType>(name: string, type: Type, required?: boolean | undefined): RawProperty<Type> | undefined {
    const property = this.get(name, required);

    if (property?.type === type) {
      return property as RawProperty<Type>;
    }

    if (required) {
      throw new Error(`Expected property "${name}" to be of type ${type}. Got type ${property?.type} instead`);
    }
  }
}
