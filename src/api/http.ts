import axios, { isAxiosError } from "axios";
import { BASE_URL } from "./config";
import { getValidCacheData, cacheData } from "../utils/cache";
import { getLocalStorage } from "../utils/localstorage";

export const CACHE_KEY_PREFIX = "cached_keyword_";

export interface ResponseDataType {
  message: string;
  statusCode: number;
}

export const cacheApi = axios.create({
  baseURL: BASE_URL,
});

export const handleError = (err: any) => {
  try {
    if (isAxiosError<ResponseDataType>(err)) {
      switch (err?.response?.data.statusCode) {
        case 400:
          alert(err.response.data.message);
          break;
        case 401:
          alert("존재하지 않는 계정입니다.");
          break;
        case 403:
          alert("접근 권한이 없습니다.");
          break;
        case 500:
        default:
          alert("요청에 실패하였습니다. 다시 시도해주세요.");
          break;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

cacheApi.interceptors.request.use((config) => {
  console.info("calling api");
  const toCacheKey = `${CACHE_KEY_PREFIX}${config.url}`;
  const validCacheData = getValidCacheData(toCacheKey);
  if (validCacheData) {
    return {
      ...config,
      data: validCacheData,
    };
  }
  return config;
});

cacheApi.interceptors.response.use((response) => {
  const toCacheKey = `${CACHE_KEY_PREFIX}${response.config.url}`;
  const isServerData = getLocalStorage(toCacheKey) === null;
  if (isServerData) {
    cacheData(toCacheKey, response.data);
  }
  return response.data;
});
