import { createModel, Property } from '../../notion';

export const WatchTrace = createModel({
  properties: {
    Date: Property.Date,
    Seasons: Property.Relation,
  },
});

export namespace WatchTrace {
  export type Instance = InstanceType<typeof WatchTrace>;
}
