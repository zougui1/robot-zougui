import _ from 'radash';

import { StoryService } from '../story.service';
import { Chapter } from '../chapter.model';
import { findChapterSuggestions } from '../utils';
import { parseUnitName } from '../../common/utils';

export class GetUrlService extends StoryService {
  findChapterSuggestions = async ({ storyName, search }: FindChapterSuggestionsOptions): Promise<Suggestion[]> => {
    const chapters = await this.findStoryChapters({ name: storyName });
    const chaptersWithUrl = chapters.filter(chapter => chapter.properties.URL.url?.trim());

    return findChapterSuggestions({
      chapters: chaptersWithUrl,
      storyName,
      search,
    });
  }

  findChapterUrls = async (options: FindChapterUrlsOptions): Promise<FindChapterUrlsResult[]> => {
    const chapters = await this.findStoryChapters({ name: options.storyName });
    const publicChapters = chapters.filter(chapter => {
      return (
        chapter.properties.URL.url?.trim() &&
        (
          !options.chapters.length ||
          options.chapters.includes(chapter.properties.Index.number)
        )
      );
    });

    const publicChapterData = publicChapters.map(chapter => {
      const index = chapter.properties.Index.number;
      const chapterName = parseUnitName(options.storyName, chapter.properties.Name.text);
      const label = chapterName
        ? `Chapter ${index}: ${chapterName}`
        : `Chapter ${index}`;

      return {
        index,
        label,
        url: chapter.properties.URL.url || '',
      };
    });

    return _.sort(publicChapterData, chapter => chapter.index);
  }

  private findStoryChapters = async ({ name }: { name: string }): Promise<Chapter.Instance[]> => {
    return await this.findChapters({
      name,
      errorMessages: {
        notFound: () => `Could not find a story named "${name}". Maybe you are already reading it.`,
        notUnique: stories => `Cannot start reading the story "${name}" as ${stories.length} stories with that name were found.`,
      },
    });
  }
}

export interface FindChapterSuggestionsOptions {
  storyName: string;
  search: string;
}

export interface FindChapterUrlsOptions {
  storyName: string;
  chapters: number[];
}

export interface FindChapterUrlsResult {
  index: number;
  label: string;
  url: string;
}

type Suggestion = { name: string; value: string; }
