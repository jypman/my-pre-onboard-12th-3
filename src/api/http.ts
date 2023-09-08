import axios, { isAxiosError } from "axios";
import { BASE_URL } from "./config";
import {
  getCacheData,
  cacheData,
  deleteExpiredSearchedCacheData,
} from "../utils";

export const SICK_CACHE_KEY_PREFIX = "cached_sick_keyword_";

export interface ResponseDataType {
  message: string;
  statusCode: number;
}

export const sickApi = axios.create({
  baseURL: BASE_URL,
});

export const handleError = (err: any) => {
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
};

sickApi.interceptors.request.use((config) => {
  console.info("calling api");
  const toCacheKey = `${SICK_CACHE_KEY_PREFIX}-${config.url}`;
  const cachedData = getCacheData(toCacheKey);
  if (cachedData.data.length > 0) {
    return {
      ...config,
      data: cachedData.data.map((item: string) => ({
        sickCd: item,
        sickNm: item,
      })),
    };
  }
  return config;
});

sickApi.interceptors.response.use((response) => {
  const toCacheKey = `${SICK_CACHE_KEY_PREFIX}-${response.config.url}`;
  const cachedData = getCacheData(toCacheKey);
  if (cachedData.data.length > 0 && cachedData.expireTime) {
    deleteExpiredSearchedCacheData(toCacheKey, cachedData.expireTime);
  } else {
    const searchText = response.config.url?.replace("/sick?q=", "");
    if (searchText && searchText.length > 0)
      cacheData(response.data, toCacheKey);
  }
  return response.data;
});
