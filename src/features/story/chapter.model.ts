import { createModel, Property } from '../../notion';

export const Chapter = createModel({
  properties: {
    Name: Property.Title,
    Index: Property.Number,
  },
});

export namespace Chapter {
  export type Instance = InstanceType<typeof Chapter>;
}
