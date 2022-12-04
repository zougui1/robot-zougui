import { EPub } from 'epub2';
import { compile } from 'html-to-text';
import fs from 'fs/promises';
import path from 'path';

import { splitWords } from './utils';

const file = '/mnt/Manjaro_Data/zougui/Downloads/The Desert Blade - by Raevocrei.epub';
const outputDir = path.join(__dirname, '../output');

// to extract text from doc, docx, pdt, txt and more use the library any-text (those files are generally chapters)
// to extract text from e-pub files use the following code (those files are generally stories containing multiple/all chapters)

const removePrefix = (text: string, prefix: string, insensitive: boolean = false): string => {
  const hasPrefix = insensitive
    ? text.toLowerCase().startsWith(prefix.toLowerCase())
    : text.startsWith(prefix);

  return hasPrefix ? text.slice(prefix.length) : text;
}

(async () => {
  const epub: EPub = await EPub.createAsync(file);

  await fs.mkdir(outputDir).catch(() => { });

  for (const chapter of epub.flow) {
    if (chapter.id) {
      const html = await epub.getChapterRawAsync(chapter.id) as string;
      const text = compile()(html);
      console.time('remove prefix')
      const textWithoutTitle = removePrefix(text, chapter.title || '', true);
      console.timeEnd('remove prefix')
      const chunks = splitWords(textWithoutTitle);
      //const count = wordCount(text);
      const count = chunks.filter((word: string) => /[a-zA-Z]/.test(word)).length;

      /*await fs.writeFile(path.join(outputDir, `${chapter.title}.json`), JSON.stringify({
        chunks,
        count
      }, null, 2))*/

      console.group(chapter.title)
      console.log((chapter as any)[EPub.SYMBOL_RAW_DATA])
      console.log(count)
      console.groupEnd()
    }
  }
  //console.log(epub);
})();
