import {
  NumberRawProperty,
  UrlRawProperty,
  SelectRawProperty,
  MultiSelectRawProperty,
  StatusRawProperty,
  DateRawProperty,
  EmailRawProperty,
  PhoneNumberRawProperty,
  CheckboxRawProperty,
  FilesRawProperty,
  CreatedByRawProperty,
  CreatedTimeRawProperty,
  LastEditedByRawProperty,
  LastEditedTimeRawProperty,
  FormulaRawProperty,
  TitleRawProperty,
  RichTextRawProperty,
  PeopleRawProperty,
  RelationRawProperty,
  RollupRawProperty,
} from './raw-types';

export interface RawPropertyTypeMap {
  number: NumberRawProperty;
  url: UrlRawProperty;
  select: SelectRawProperty;
  multi_select: MultiSelectRawProperty;
  status: StatusRawProperty;
  date: DateRawProperty;
  email: EmailRawProperty;
  phone_number: PhoneNumberRawProperty;
  checkbox: CheckboxRawProperty;
  files: FilesRawProperty;
  created_by: CreatedByRawProperty;
  created_time: CreatedTimeRawProperty;
  last_edited_by: LastEditedByRawProperty;
  last_edited_time: LastEditedTimeRawProperty;
  formula: FormulaRawProperty;
  title: TitleRawProperty;
  rich_text: RichTextRawProperty;
  people: PeopleRawProperty;
  relation: RelationRawProperty;
  rollup: RollupRawProperty;
}
