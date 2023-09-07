import axios, { isAxiosError } from "axios";
import { BASE_URL } from "./config";

export interface ResponseDataType {
  message: string;
  statusCode: number;
}

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

const http = axios.create({
  timeout: 5000,
  baseURL: BASE_URL,
});

http.interceptors.response.use((res) => {
  return res.data;
});

export default http;
