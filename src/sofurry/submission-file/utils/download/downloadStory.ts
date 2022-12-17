import axios from 'axios';

import { writeStreamToFile } from '../../../../utils';

export const downloadStory = async (url: string, output: string): Promise<void> => {
  const response = await axios.get(url, {
    responseType: 'stream',
    headers: {
      'Accept-Encoding': 'utf8'
    }
  });

  await writeStreamToFile(response.data, output);
}
