import { UserObjectResponse, PartialUserObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { PropertyType } from './PropertyType';
import {
  SelectPropertyRawResponse,
  DateRawResponse,
  ExternalFileRawResponse,
  FileFileRawResponse,
  FormulaPropertyRawResponse,
  RollupRawResponse,
} from './raw-response-types';

export interface BaseRawProperty {
  id: string;
  type: PropertyType;
}

export interface NumberRawProperty extends BaseRawProperty {
  type: 'number';
  number: number | null;
}

export interface UrlRawProperty extends BaseRawProperty {
  type: 'url';
  url: string | null;
}

export interface SelectRawProperty extends BaseRawProperty {
  type: 'select';
  select: SelectPropertyRawResponse | null;
}

export interface MultiSelectRawProperty extends BaseRawProperty {
  type: 'multi_select';
  multi_select: SelectPropertyRawResponse[];
}

export interface StatusRawProperty extends BaseRawProperty {
  type: 'status';
  status: SelectPropertyRawResponse | null;
}

export interface DateRawProperty extends BaseRawProperty {
  type: 'date';
  date: DateRawResponse | null;
}

export interface EmailRawProperty extends BaseRawProperty {
  type: 'email';
  email: string | null;
}

export interface PhoneNumberRawProperty extends BaseRawProperty {
  type: 'phone_number';
  phone_number: string | null;
}

export interface CheckboxRawProperty extends BaseRawProperty {
  type: 'checkbox';
  checkbox: boolean | null;
}

export interface FilesRawProperty extends BaseRawProperty {
  type: 'files';
  files: (ExternalFileRawResponse | FileFileRawResponse)[];
}

export interface CreatedByRawProperty extends BaseRawProperty {
  type: 'created_by';
  created_by: PartialUserObjectResponse | UserObjectResponse;
}

export interface CreatedTimeRawProperty extends BaseRawProperty {
  type: 'created_time';

  created_time: string;
}

export interface LastEditedByRawProperty extends BaseRawProperty {
  type: 'last_edited_by';
  last_edited_by: PartialUserObjectResponse | UserObjectResponse;
}

export interface LastEditedTimeRawProperty extends BaseRawProperty {
  type: 'last_edited_time';

  last_edited_time: string;
}

export interface FormulaRawProperty extends BaseRawProperty {
  type: 'formula';

  formula: FormulaPropertyRawResponse;
}

export interface TitleRawProperty extends BaseRawProperty {
  type: 'title';

  title: RichTextItemResponse[];
}

export interface RichTextRawProperty extends BaseRawProperty {
  type: 'rich_text';

  rich_text: RichTextItemResponse[];
}

export interface PeopleRawProperty extends BaseRawProperty {
  type: 'people';

  people: (PartialUserObjectResponse | UserObjectResponse)[];
}

export interface RelationRawProperty extends BaseRawProperty {
  type: 'relation';

  relation: { id: string }[];
}

export interface RollupRawProperty extends BaseRawProperty {
  type: 'rollup';

  rollup: RollupRawResponse;
}

export type AnyRawProperty = (
  | NumberRawProperty
  | UrlRawProperty
  | SelectRawProperty
  | MultiSelectRawProperty
  | StatusRawProperty
  | DateRawProperty
  | EmailRawProperty
  | PhoneNumberRawProperty
  | CheckboxRawProperty
  | FilesRawProperty
  | CreatedByRawProperty
  | CreatedTimeRawProperty
  | LastEditedByRawProperty
  | LastEditedTimeRawProperty
  | FormulaRawProperty
  | TitleRawProperty
  | RichTextRawProperty
  | PeopleRawProperty
  | RelationRawProperty
  | RollupRawProperty
);
