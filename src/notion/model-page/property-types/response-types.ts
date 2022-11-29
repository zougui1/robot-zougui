import { DateTime } from 'luxon';
import { UserObjectResponse, PartialUserObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { TimeZoneRequest, RollupFunction, SelectColor } from '../../types';

export interface SelectPropertyResponse {
  id: string;
  name: string;
  color: SelectColor;
}

export interface DateResponse {
  start: DateTime;
  end: DateTime | null;
  timeZone: TimeZoneRequest | null;
}

//#region file response
export interface FileFileResponse {
  url: string;
  expiryTime: string;
  name: string;
  type?: 'file';
}

export interface ExternalFileResponse {
  url: string;
  name: string;
  type?: 'external';
}
//#endregion

//#region formula response
export interface StringFormulaPropertyResponse {
  type: 'string';
  string: string | null;
}

export interface DateFormulaPropertyResponse {
  type: 'date';
  date: DateResponse | null;
}

export interface NumberFormulaPropertyResponse {
  type: 'number';
  number: number | null;
}

export interface BooleanFormulaPropertyResponse {
  type: 'boolean';
  boolean: boolean | null;
}

export type FormulaPropertyResponse = StringFormulaPropertyResponse | DateFormulaPropertyResponse | NumberFormulaPropertyResponse | BooleanFormulaPropertyResponse;
//#endregion

//#region rollup response
export interface NumberRollupResponse {
  type: 'number';
  number: number | null;
  function: RollupFunction;
}

export interface DateRollupResponse {
  type: 'date';
  date: DateResponse | null;
  function: RollupFunction;
}

//#region array rollup response
export interface TitleRollupResponse {
  type: 'title';
  title: RichTextItemResponse[];
}

export interface RichTextRollupResponse {
  type: 'rich_text';
  rich_text: RichTextItemResponse[];
}

export interface PeopleRollupResponse {
  type: 'people';
  people: (UserObjectResponse | PartialUserObjectResponse)[];
}

export interface RelationRollupResponse {
  type: 'relation';
  relation: { id: string }[];
}
//#endregion

export interface ArrayRollupResponse {
  type: 'array';
  array: (TitleRollupResponse | RichTextRollupResponse | PeopleRollupResponse | RelationRollupResponse)[];
  //array: any;
  function: RollupFunction;
}

export type RollupResponse = (
  | NumberRollupResponse
  | DateRollupResponse
  | ArrayRollupResponse
);
//#endregion
