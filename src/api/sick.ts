import http from "./http";
import { API } from "./config";

export interface IResponseSick {
  sickCd: string;
  sickNm: string;
}

export const getSickList = (searchedText: string): Promise<IResponseSick[]> => {
  return http.get(`${API.SICK}?q=${searchedText}`);
};
