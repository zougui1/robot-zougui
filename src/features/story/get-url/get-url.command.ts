import { DateTime } from 'luxon';

import { GetUrlService } from './get-url.service';
import { storyNameOption } from '../options';
import { Command, Option } from '../../../discord';
import { parseListableNumber } from '../../../utils';

const discordMessageMaxCharacters = 2000;
const truncatedTextReplacement = '\n...';

const chaptersOption = new Option('[chapters]')
  .description('Chapters of the story')
  .autocomplete(async ({ value, interaction }) => {
    const storyName = interaction.options.getString('story-name', true);
    const service = new GetUrlService();

    return await service.findChapterSuggestions({
      storyName,
      search: value,
    });
  })
  .addTransform(arg => arg ? parseListableNumber(arg, { strict: true }) : []);

export const subCommandGetUrl = new Command('get-url')
  .description('Get the URLs of a story')
  .addOption(storyNameOption)
  .addOption(chaptersOption)
  .action(async ({ options, reply }) => {
    reply.defer();
    const service = new GetUrlService();

    const chapters = await service.findChapterUrls({
      ...options,
      chapters: options.chapters || [],
    });

    const chapterList = chapters
      .map(chapter => `${chapter.label}; <${chapter.url}>`)
      .join('\n');

    const chaptersText = chapterList.trim() || 'No chapters found';
    const text = `__${options.storyName}__\n\n${chaptersText}`.slice(0, discordMessageMaxCharacters);

    const trimmedText = text.length > discordMessageMaxCharacters
      ? text.slice(0, discordMessageMaxCharacters - truncatedTextReplacement.length)
      : text;

    const sanitizedText = text.endsWith('>')
      ? trimmedText
      : trimmedText.split('\n').slice(0, -1).join('\n');

    const cleanText = text === sanitizedText
      ? text
      : `${sanitizedText}${truncatedTextReplacement}`;

    await reply.sendContent(cleanText);
  });

export type { } from 'zod';
