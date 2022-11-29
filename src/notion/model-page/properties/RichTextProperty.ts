import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { RichTextRawProperty } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';

export class NullableRichTextProperty implements ModelProperty<'rich_text'> {
  static readonly type: 'rich_text' = 'rich_text';

  id: string;
  type: 'rich_text';
  /**
   * alias for `richTexts[0].plain_text`
   */
  text: string | null;
  richTexts: RichTextItemResponse[];

  constructor(property: RichTextRawProperty) {
    this.id = property.id;
    this.type = property.type;
    this.text = property.rich_text.at(0)?.plain_text ?? null;
    this.richTexts = property.rich_text;
  }
}

export class RichTextProperty implements ModelProperty<'rich_text'> {
  static readonly type: 'rich_text' = 'rich_text';
  static readonly Nullable = NullableRichTextProperty;

  id: string;
  type: 'rich_text';
  /**
   * alias for `richTexts[0].plain_text`
   */
  text: string;
  richTexts: RichTextItemResponse[];

  constructor(property: RichTextRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;

    const firstRichText = property.rich_text.at(0);

    if (firstRichText == null) {
      throw new Error(`The property "${options.name}" is not nullable`);
    }

    this.text = firstRichText.plain_text;
    this.richTexts = property.rich_text;
  }
}

export namespace RichTextProperty {
  export type Nullable = NullableRichTextProperty;
}
