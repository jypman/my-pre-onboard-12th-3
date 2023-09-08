import { IResponseSick } from "../api/sick";
import { getLocalStorage } from "./localstorage";

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const EXPIRED_CACHED_SEARCH_TIME = MINUTE;

export interface ICacheData {
  data: string[];
  expireTime: string | null;
}

type CacheType = IResponseSick | string;

export const cacheData = (cacheKey: string, toCacheData: CacheType[]): void => {
  window.localStorage.setItem(
    cacheKey,
    JSON.stringify({ expireTime: new Date().getTime(), data: toCacheData }),
  );
};

export const getCachedData = (cacheKey: string): ICacheData => {
  const val = getLocalStorage(cacheKey);
  return val === null ? { data: [], expireTime: null } : JSON.parse(val);
};

export const deleteExpiredCacheData = (
  cacheKey: string,
  cachedDate: number,
): void => {
  const now = new Date().getTime();
  if (now > cachedDate + EXPIRED_CACHED_SEARCH_TIME) {
    window.localStorage.removeItem(cacheKey);
  }
};

export const getValidCacheData = (cacheKey: string): ICacheData | null => {
  const cachedData: ICacheData = getCachedData(cacheKey);
  if (cachedData.expireTime) {
    deleteExpiredCacheData(cacheKey, Number(cachedData.expireTime));
  }
  return getLocalStorage(cacheKey) ? cachedData : null;
};
