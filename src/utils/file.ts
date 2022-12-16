import path from 'node:path';

import { compile } from 'html-to-text';
import fs from 'fs-extra';
import { getText } from 'any-text';
import rtfToHtml from '@iarna/rtf-to-html';

import { removeBbCode } from './string';

export const writeStreamToFile = async (stream: fs.ReadStream, output: string): Promise<void> => {
  const writeStream = stream.pipe(fs.createWriteStream(output));

  try {
    await new Promise((resolve, reject) => {
      writeStream.once('finish', resolve);
      writeStream.once('error', reject);
    });
  } finally {
    writeStream.removeAllListeners();
  }
}

const readRtfText = async (filePath: string): Promise<string> => {
  const html = await new Promise<string>((resolve, reject) => {
    rtfToHtml.fromStream(fs.createReadStream(filePath), (err, html) => {
      if (err) return reject(err);
      resolve(html);
    });
  });

  const text = compile()(html);
  return text;
}

const textReaders: Record<Extension, (filePath: string) => Promise<string>> = {
  '.rtf': readRtfText,
};

export const readText = async (filePath: string): Promise<string> => {
  const extension = path.extname(filePath) as Extension;
  const textReader = textReaders[extension] || getText;
  const text = await textReader(filePath);
  return removeBbCode(text);
}

type Extension = `.${string}`;
