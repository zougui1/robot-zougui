import { CheckboxProperty } from './CheckboxProperty';
import { CreatedByProperty } from './CreatedByProperty';
import { CreatedTimeProperty } from './CreatedTimeProperty';
import { DateProperty } from './DateProperty';
import { EmailProperty } from './EmailProperty';
import { FilesProperty } from './FilesProperty';
import { FormulaProperty } from './FormulaProperty';
import { LastEditedByProperty } from './LastEditedByProperty';
import { LastEditedTimeProperty } from './LastEditedTimeProperty';
import { MultiSelectProperty } from './MultiSelectProperty';
import { NumberProperty } from './NumberProperty';
import { PeopleProperty } from './PeopleProperty';
import { PhoneNumberProperty } from './PhoneNumberProperty';
import { RelationProperty } from './RelationProperty';
import { RichTextProperty } from './RichTextProperty';
import { RollupProperty } from './RollupProperty';
import { SelectProperty } from './SelectProperty';
import { StatusProperty } from './StatusProperty';
import { TitleProperty } from './TitleProperty';
import { UrlProperty } from './UrlProperty';

export const Property = {
  Checkbox: CheckboxProperty,
  CreatedBy: CreatedByProperty,
  CreatedTime: CreatedTimeProperty,
  Date: DateProperty,
  Email: EmailProperty,
  Files: FilesProperty,
  Formula: FormulaProperty,
  LastEditedBy: LastEditedByProperty,
  LastEditedTime: LastEditedTimeProperty,
  MultiSelect: MultiSelectProperty,
  Number: NumberProperty,
  People: PeopleProperty,
  PhoneNumber: PhoneNumberProperty,
  Relation: RelationProperty,
  RichText: RichTextProperty,
  Rollup: RollupProperty,
  Select: SelectProperty,
  Status: StatusProperty,
  Title: TitleProperty,
  Url: UrlProperty,
};

export namespace Property {
  export type Checkbox = CheckboxProperty;
  export type CreatedBy = CreatedByProperty;
  export type CreatedTime = CreatedTimeProperty;
  export type Date = DateProperty;
  export type Email = EmailProperty;
  export type Files = FilesProperty;
  export type Formula = FormulaProperty;
  export type LastEditedBy = LastEditedByProperty;
  export type LastEditedTime = LastEditedTimeProperty;
  export type MultiSelect = MultiSelectProperty;
  export type Number = NumberProperty;
  export type People = PeopleProperty;
  export type PhoneNumber = PhoneNumberProperty;
  export type Relation = RelationProperty;
  export type RichText = RichTextProperty;
  export type Rollup = RollupProperty;
  export type Select = SelectProperty;
  export type Status = StatusProperty;
  export type Title = TitleProperty;
  export type Url = UrlProperty;

  export namespace Checkbox {
    export type Nullable = CheckboxProperty.Nullable;
  }

  export namespace Number {
    export type Nullable = NumberProperty.Nullable;
  }

  export namespace Url {
    export type Nullable = UrlProperty.Nullable;
  }

  export namespace Select {
    export type Nullable = SelectProperty.Nullable;
  }

  export namespace Status {
    export type Nullable = StatusProperty.Nullable;
  }

  export namespace Date {
    export type Nullable = DateProperty.Nullable;
  }

  export namespace Email {
    export type Nullable = EmailProperty.Nullable;
  }

  export namespace PhoneNumber {
    export type Nullable = PhoneNumberProperty.Nullable;
  }

  export namespace Title {
    export type Nullable = TitleProperty.Nullable;
  }

  export namespace RichText {
    export type Nullable = RichTextProperty.Nullable;
  }
}
