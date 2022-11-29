import { FilesRawProperty, FileFileRawResponse, ExternalFileRawResponse } from '../../page';
import { ModelProperty, ModelPropertyOptions } from '../types';
import { FileFileResponse, ExternalFileResponse } from '../property-types';

export class FilesProperty implements ModelProperty<'files'> {
  static readonly type: 'files' = 'files';

  id: string;
  type: 'files';
  files: (FileFileResponse | ExternalFileResponse)[];

  constructor(property: FilesRawProperty, options: ModelPropertyOptions) {
    this.id = property.id;
    this.type = property.type;
    this.files = property.files.map(file => {
      if (!file.type) {
        throw new Error(`The property "${options.name}" cannot have a file without a type`);
      }

      const convertFile = fileConverters[file.type] as UnknownFileConverter;

      if (!convertFile) {
        throw new Error(`The property "${options.name}" has a file of type "${file.type}" which is not supported`);
      }

      return convertFile(file);
    });
  }
}

const fileConverters = {
  file: (file: FileFileRawResponse): FileFileResponse => ({
    name: file.name,
    type: file.type,
    url: file.file.url,
    expiryTime: file.file.expiry_time,
  }),

  external: (file: ExternalFileRawResponse): ExternalFileResponse => ({
    name: file.name,
    type: file.type,
    url: file.external.url,
  }),
};

type UnknownFileConverter = (file: FileFileRawResponse | ExternalFileRawResponse) => FileFileResponse | ExternalFileResponse;
