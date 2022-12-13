import { createModel, Property } from '../../notion';

export const Fap = createModel({
  properties: {
    Date: Property.Date,
    Content: Property.Select,
  },
});

export namespace Fap {
  export type Instance = InstanceType<typeof Fap>;
}
