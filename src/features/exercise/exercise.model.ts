import { createModel, Property } from '../../notion';

export const Exercise = createModel({
  properties: {
    Name: Property.Title,
    Weight: Property.Number,
    Reps: Property.Number,
    Date: Property.Date,
    'Targeted muscle regions': Property.MultiSelect,
  },
});

export namespace Exercise {
  export type Instance = InstanceType<typeof Exercise>;
}
