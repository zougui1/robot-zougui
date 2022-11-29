import { createModel, Property } from '../../notion';

export const Season = createModel({
  properties: {
    Name: Property.Title,
    Index: Property.Number,
  },
});

export namespace Season {
  export type Instance = InstanceType<typeof Season>;
}
