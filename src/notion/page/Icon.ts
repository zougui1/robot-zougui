import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export class Icon {
  url: string | undefined;
  expiryTime: string | undefined;
  type: IconType;
  emoji: string | undefined;

  constructor(icon: NonNullable<PageObjectResponse['icon']>) {
    this.type = icon.type;

    if (icon.type === 'external') {
      this.url = icon.external.url;
    } else if(icon.type === 'file') {
      this.url = icon.file.url;
      this.expiryTime = icon.file.expiry_time;
    } else {
      this.emoji = icon.emoji;
    }
  }
}

export type IconType = 'emoji' | 'external' | 'file';
