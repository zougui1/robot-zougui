import path from 'node:path';
import URL from 'node:url';

import fs from 'fs-extra';
import { getText } from 'any-text';
import _ from 'radash';

import { Furaffinity, Submission } from './furaffinity';
import { splitWords } from './utils';
import env from './env';

(async () => {
  const submissionId = '49013926';
  const submissionUrl = 'https://www.furaffinity.net/view/20278684/';
  const destDir = '/mnt/Manjaro_Data/zougui/workspace/temp/';
  const wordFile = path.join(destDir, 'words.json');

  console.log(URL.parse(submissionUrl));

  // cookies no longer work for some reasons. renew them
  Furaffinity.login(env.furaffinity.cookie.a, env.furaffinity.cookie.b);
  const submission = await Submission.find(submissionUrl);

  if (!submission) {
    console.log('submission not found');
    return;
  }

  console.log(submission.publishedAt.toISO());
  const { destFile } = await submission.file.downloadToDir(destDir);

  console.log('downloaded');
  console.time('getText')
  const text = await getText(destFile);
  const words = splitWords(text);
  console.timeEnd('getText')
  console.log('words:', words.length)
  await fs.writeJson(wordFile, words, { spaces: 2 });
  await fs.writeFile(path.join(destDir, 'text.txt'), text);
})();
