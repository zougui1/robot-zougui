import { PropertyType, RawPropertyTypeMap } from './property-types';

export class RawProperty<Type extends PropertyType = PropertyType> {
  raw: RawPropertyTypeMap[Type];
  type: Type;
  id: string;

  constructor(property: RawPropertyTypeMap[Type]) {
    this.raw = property;
    this.type = property.type as Type;
    this.id = property.id;
  }
}
