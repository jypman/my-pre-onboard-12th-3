export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const EXPIRED_CACHED_SEARCH_TIME = MINUTE * 3;

export interface ICacheData {
  data: string[];
  expireTime: string | null;
}

export const cacheData = (toCacheData: any[], cacheKey: string): void => {
  window.localStorage.setItem(
    cacheKey,
    JSON.stringify({ expireTime: new Date().getTime(), data: toCacheData }),
  );
};

export const getCacheData = (cacheKey: string): ICacheData => {
  const val = window.localStorage.getItem(cacheKey);
  return val === null ? { data: [], expireTime: null } : JSON.parse(val);
};

export const deleteExpiredSearchedCacheData = (
  cacheKey: string,
  cachedDate: string,
): void => {
  const toNumberCachedDate: number = Number(cachedDate);
  const now = new Date().getTime();
  if (now > toNumberCachedDate + EXPIRED_CACHED_SEARCH_TIME) {
    window.localStorage.removeItem(cacheKey);
  }
};

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
