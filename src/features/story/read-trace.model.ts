import { createModel, Property } from '../../notion';

export const ReadTrace = createModel({
  properties: {
    Date: Property.Date,
    Chapters: Property.Relation,
  },
});

export namespace ReadTrace {
  export type Instance = InstanceType<typeof ReadTrace>;
}
