import { Duration, DateTime } from 'luxon';
import { ms } from '@zougui/common.ms';

import { Furaffinity, Submission } from './furaffinity';
import env from './env';

(async () => {
  const submissionId = '49013926';
  const submissionUrl = 'https://www.furaffinity.net/view/49013926/';

  // cookies no longer work for some reasons. renew them
  Furaffinity.login(env.furaffinity.cookie.a, env.furaffinity.cookie.b);
  const submission = await Submission.find(submissionUrl);
  console.log(submission?.publishedAt.toISO());
})();
