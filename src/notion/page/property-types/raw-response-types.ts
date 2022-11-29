import { UserObjectResponse, PartialUserObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { TimeZoneRequest, RollupFunction, SelectColor } from '../../types';

export interface SelectPropertyRawResponse {
  id: string;
  name: string;
  color: SelectColor;
}

export interface DateRawResponse {
  start: string;
  end: string | null;
  time_zone: TimeZoneRequest | null;
}

//#region file response
export interface FileFileRawResponse {
  file: {
    url: string;
    expiry_time: string;
  };
  name: string;
  type?: 'file';
}

export interface ExternalFileRawResponse {
  external: {
    url: string;
  };
  name: string;
  type?: 'external';
}
//#endregion

//#region formula response
export interface StringFormulaPropertyRawResponse {
  type: 'string';
  string: string | null;
}

export interface DateFormulaPropertyRawResponse {
  type: 'date';
  date: DateRawResponse | null;
}

export interface NumberFormulaPropertyRawResponse {
  type: 'number';
  number: number | null;
}

export interface BooleanFormulaPropertyRawResponse {
  type: 'boolean';
  boolean: boolean | null;
}

export type FormulaPropertyRawResponse = StringFormulaPropertyRawResponse | DateFormulaPropertyRawResponse | NumberFormulaPropertyRawResponse | BooleanFormulaPropertyRawResponse;
//#endregion

//#region rollup response
export interface NumberRollupRawResponse {
  type: 'number';
  number: number | null;
  function: RollupFunction;
}

export interface DateRollupRawResponse {
  type: 'date';
  date: DateRawResponse | null;
  function: RollupFunction;
}

//#region array rollup response
export interface TitleRollupRawResponse {
  type: 'title';
  title: RichTextItemResponse[];
}

export interface RichTextRollupRawResponse {
  type: 'rich_text';
  rich_text: RichTextItemResponse[];
}

export interface PeopleRollupRawResponse {
  type: 'people';
  people: (UserObjectResponse | PartialUserObjectResponse)[];
}

export interface RelationRollupRawResponse {
  type: 'relation';
  relation: { id: string }[];
}
//#endregion

export interface ArrayRollupRawResponse {
  type: 'array';
  array: (TitleRollupRawResponse | RichTextRollupRawResponse | PeopleRollupRawResponse | RelationRollupRawResponse)[];
  //array: any;
  function: RollupFunction;
}

export type RollupRawResponse = (
  | NumberRollupRawResponse
  | DateRollupRawResponse
  | ArrayRollupRawResponse
);
//#endregion
