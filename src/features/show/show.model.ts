import { createModel, Property } from '../../notion';

export const Show = createModel({
  properties: {
    Name: Property.Title,
  },
});

export namespace Show {
  export type Instance = InstanceType<typeof Show>;
}
