import { RelationRawProperty } from '../../page';
import { ModelProperty } from '../types';

export class RelationProperty implements ModelProperty<'relation'> {
  static readonly type: 'relation' = 'relation';

  id: string;
  type: 'relation';
  /**
   * alias for `relations[].id`
   */
  relationIds: string[];
  relations: { id: string }[];

  constructor(property: RelationRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.relationIds = property.relation.map(relation => relation.id);
    this.relations = [...property.relation];
  }
}
