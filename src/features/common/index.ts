/**
 * option object for the final functions that will create the sub-commands start and end
 * as well as their options, notion and service classes
 */
 interface PrototypeStartOptions {
  /**
   * i.e. story, show
   */
  series: {
    label: {
      singular: string;
      plural: string;
    };
  };

  /**
   * i.e. chapter, season
   */
  unit: {
    label: {
      singular: string;
      plural: string;
    };

    properties: {
      /**
       * i.e. Story, Show
       * @relation
       */
      series: string;
      /**
       * i.e. Index
       */
      index: string;
    };
  };

  status: {
    label: {
      /**
       * i.e. reading, watching
       */
      doing: string;
      /**
       * i.e. read, watched
       */
      done: string;
      /**
       * i.e. read, watch
       */
      do: string;
    };
  };
}
