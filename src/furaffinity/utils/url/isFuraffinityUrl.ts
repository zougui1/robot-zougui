import { isAbsoluteUrl } from '@zougui/common.url-utils';

const reFuraffinityDomain = /^https?:\/\/(www.)?furaffinity.net(\/.*)?$/;

export const isFuraffinityUrl = (url: string): boolean => {
  return isAbsoluteUrl(url) && reFuraffinityDomain.test(url);
}
