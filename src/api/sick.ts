import { sickApi } from "./http";
import { API } from "./config";

export interface IResponseSick {
  sickCd: string;
  sickNm: string;
}
export const getSick = async (searchKey: string): Promise<IResponseSick[]> => {
  return sickApi.get(`${API.SICK}?q=${searchKey}`);
};
