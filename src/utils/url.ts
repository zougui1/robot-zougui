import URL from 'node:url';

import { joinUrl } from '@zougui/common.url-utils';
import { removeSuffix } from '@zougui/common.string-utils';

export const isPathNameValid = (url: string, pathNameScheme: string): boolean => {
  const urlObject = URL.parse(url);

  if (!urlObject.pathname) {
    return false;
  }

  const urlPathNameParts = splitPathName(urlObject.pathname);
  const pathNameSchemeParts = splitPathName(pathNameScheme);

  if (urlPathNameParts.length !== pathNameSchemeParts.length) {
    return false;
  }

  return urlPathNameParts.every((urlPathName, index) => {
    const pathNameScheme = pathNameSchemeParts[index];

    // the path name part is expected to be a dynamic value
    if (pathNameScheme.startsWith(':')) {
      return true;
    }

    return pathNameScheme === urlPathName;
  });
}

const splitPathName = (pathName: string): string[] => {
  return pathName.split('/').filter(Boolean);
}

export const removeTrailingSlash = (url: string): string => {
  return removeSuffix(url, '/');
}

export const removeQueryString = (url: string): string => {
  const urlObject = URL.parse(url);
  const origin = `${urlObject.protocol}//${urlObject.host}`;

  if (!urlObject.pathname) {
    return origin;
  }

  return joinUrl(origin, urlObject.pathname);
}
