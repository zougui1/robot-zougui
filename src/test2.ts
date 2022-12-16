import URL from 'node:url';

import QS from 'qs';

import { isUrlValid } from './utils';

(async () => {
  const url = 'https://api2.sofurry.com/std/getSubmissionDetails?id=12345';
  const urlValid = isUrlValid(url, '/std/getSubmissionDetails?id');
  console.log('isUrlValid:', urlValid);
})();
