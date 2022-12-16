const reSoFurryDomain = /^https?:\/\/(www\.)?soffury\.com(\/.*)?$/;
const reSoFurryApiDomain = /^https?:\/\/api2\.sofurry\.com(\/.*)?$/;

export const getIsSoFurryUrl = (url: string): boolean => {
  return reSoFurryDomain.test(url) || reSoFurryApiDomain.test(url);
}
