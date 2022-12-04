import { IAuthor } from 'furaffinity-api';

export class Author {
  id: string;
  name: string;
  url: string;
  avatar: string | undefined;

  constructor(author: IAuthor) {
    this.id = author.id;
    this.name = author.name;
    this.url = author.url;
    this.avatar = author.avatar;
  }
}
