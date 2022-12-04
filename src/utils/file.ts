import fs from 'fs-extra';

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
