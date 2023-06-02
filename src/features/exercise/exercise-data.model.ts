import { createModel, Property } from '../../notion';

export const ExerciseData = createModel({
  properties: {
    Name: Property.Title,
    'Targeted muscle regions': Property.MultiSelect,
  },
});

export namespace ExerciseData {
  export type Instance = InstanceType<typeof ExerciseData>;
}
