import { Chapter } from '../../chapter.model';
import { removeTrailingSlash, removeQueryString } from '../../../../utils';

const reWWW = /^https?:\/\/www./;
const protocol = 'https://';

export const findChapterByUrl = (chapters: Chapter.Instance[], url: string): Chapter.Instance | undefined => {
  url = url.replace(reWWW, protocol);

  return chapters.find(chapter => {
    if (!chapter.properties.URL.url) {
      return;
    }

    const chapterUrl = removeTrailingSlash(removeQueryString(chapter.properties.URL.url));
    return chapterUrl.replace(reWWW, protocol) === url;
  });
}
