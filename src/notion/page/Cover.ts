import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export class Cover {
  url: string;
  expiryTime: string | undefined;
  type: CoverType;

  constructor(cover: NonNullable<PageObjectResponse['cover']>) {
    this.type = cover.type;

    if (cover.type === 'external') {
      this.url = cover.external.url;
    } else {
      this.url = cover.file.url;
      this.expiryTime = cover.file.expiry_time;
    }
  }
}

export type CoverType = 'external' | 'file';
