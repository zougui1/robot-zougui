import axios from 'axios';

import { SoFurrySubmission } from '../internal-types';

export const findSubmission = async (url: string): Promise<Omit<SoFurrySubmission, 'id'> | undefined> => {
  const { data } = await axios.get<Omit<SoFurrySubmission, 'id'>>(url, {
    headers: {
      'Accept-Encoding': 'utf-8',
    }
  });
  return data;
}
