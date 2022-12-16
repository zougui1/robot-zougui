declare module '@iarna/rtf-to-html' {
  import fs from 'fs-extra';

  export declare function fromStream(stream: fs.ReadStream, callback: (error: null, html: string) => void);
  export declare function fromStream(stream: fs.ReadStream, callback: (error: Error, html: undefined | null) => void);

  export default {
    fromStream,
  }
}
