import { Chapter } from '../chapter.model';
import { findUnitsSuggestions } from '../../common/utils';

export const findChapterSuggestions = (options: FindChapterSuggestionsOptions): Suggestion[] => {
  return findUnitsSuggestions(options.chapters, {
    search: options.search,
    seriesName: options.storyName,
    label: {
      singular: 'Chapter',
      plural: 'Chapters',
    },
    addUnitNameToSuggestions: true,
    getUnitNumber: chapter => chapter.properties.Index.number,
    getUnitName: chapter => chapter.properties.Name.text,
  });
}

export interface FindChapterSuggestionsOptions {
  chapters: Chapter.Instance[];
  search: string;
  storyName: string;
}

type Suggestion = { name: string; value: string; }
