import { downloadStory } from './downloadStory';
import { ContentType, ReverseContentType } from '../../../submission/ContentType';

const downloaders: Partial<Record<ContentType, (url: string, output: string) => Promise<void>>> = {
  [ContentType.Story]: downloadStory,
};

export const downloadSubmissionFile = async (url: string, output: string, type: ContentType): Promise<void> => {
  const downloader = downloaders[type];

  if (!downloader) {
    throw new Error(`Cannot download submission of type "${ReverseContentType[type]}"`);
  }

  return await downloader(url, output);
}
