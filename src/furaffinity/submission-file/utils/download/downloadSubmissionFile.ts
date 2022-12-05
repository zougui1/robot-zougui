import { Category } from 'furaffinity-api';

import { downloadStory } from './downloadStory';

const downloaders: Partial<Record<Category, (url: string, output: string) => Promise<void>>> = {
  [Category.Story]: downloadStory,
};

export const downloadSubmissionFile = async (url: string, output: string, category: Category): Promise<void> => {
  const downloader = downloaders[category];

  if (!downloader) {
    throw new Error(`Cannot download submission of category "${category}"`);
  }

  return await downloader(url, output);
}
