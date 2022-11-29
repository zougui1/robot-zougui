import { createModel, Property } from '../../notion';

export const Story = createModel({
  properties: {
    Name: Property.Title,
  },
});

export namespace Story {
  export type Instance = InstanceType<typeof Story>;
}
