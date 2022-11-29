import { Property } from '../properties';

export type AnyProperty = (
  | Property.Number
  | Property.Number.Nullable
  | Property.Url
  | Property.Url.Nullable
  | Property.Select
  | Property.Select.Nullable
  | Property.MultiSelect
  | Property.Status
  | Property.Status.Nullable
  | Property.Date
  | Property.Date.Nullable
  | Property.Email
  | Property.Email.Nullable
  | Property.PhoneNumber
  | Property.PhoneNumber.Nullable
  | Property.Checkbox
  | Property.Checkbox.Nullable
  | Property.Files
  | Property.CreatedBy
  | Property.CreatedTime
  | Property.LastEditedBy
  | Property.LastEditedTime
  | Property.Formula
  | Property.Title
  | Property.Title.Nullable
  | Property.RichText
  | Property.RichText.Nullable
  | Property.People
  | Property.Relation
  | Property.Rollup
);
