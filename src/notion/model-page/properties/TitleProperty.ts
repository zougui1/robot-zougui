import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { TitleRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';

export class NullableTitleProperty implements ModelProperty<'title'> {
  static readonly type: 'title' = 'title';

  id: string;
  type: 'title';
  /**
   * alias for `titles[0].plain_text`
   */
  text: string | null;
  titles: RichTextItemResponse[];

  constructor(property: TitleRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.text = property.title.at(0)?.plain_text ?? null;
    this.titles = property.title;
  }
}

export class TitleProperty implements ModelProperty<'title'> {
  static readonly type: 'title' = 'title';
  static readonly Nullable = NullableTitleProperty;

  id: string;
  type: 'title';
  /**
   * alias for `titles[0].plain_text`
   */
  text: string;
  titles: RichTextItemResponse[];

  constructor(property: TitleRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    const firstTitle = property.title.at(0);

    if (firstTitle == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.text = firstTitle.plain_text;
    this.titles = property.title;
  }
}

export namespace TitleProperty {
  export type Nullable = NullableTitleProperty;
}
