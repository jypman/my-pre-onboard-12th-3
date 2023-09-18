import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Home } from "../pages/Home";
import * as remotes from "../api/sick";
import { CACHE_KEY_PREFIX } from "../api/http";
import { delay } from "../utils/utils";
import { getValidCacheData } from "../utils/cache";
import { getLocalStorage } from "../utils/localstorage";
import { IResponseSick } from "../api/sick";

const searchText = "암";
const apiEndPoint = "/sick?q='암'";
const cacheKey = `${CACHE_KEY_PREFIX}${apiEndPoint}`;
const resMockData: IResponseSick[] = [
  { sickCd: "1", sickNm: "간암" },
  { sickCd: "2", sickNm: "피부암" },
];

jest.mock("axios", () => {
  return {
    isAxiosError: false,
    create: jest.fn(() => ({
      interceptors: {
        request: {
          use: (
            callback: (config: {
              url: string;
              data: remotes.IResponseSick[];
            }) => InternalAxiosRequestConfig,
          ) =>
            callback({
              url: apiEndPoint,
              data: resMockData,
            }),
        },
        response: {
          use: (
            callback: (res: {
              config: {
                url: string;
              };
              data: remotes.IResponseSick[];
            }) => AxiosResponse,
          ) =>
            callback({
              config: { url: apiEndPoint },
              data: resMockData,
            }).data,
        },
      },
    })),
  };
});
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("홈페이지", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("검색 UI 클릭 시 검색 인풋과 추천 검색어 모달 렌더링", async () => {
    render(<Home />);

    const searchForm = await screen.findByTestId("search-form");

    userEvent.click(searchForm);

    const searchInput = await screen.findByRole("textbox");
    const searchModal = await screen.findByText("추천 검색어");

    expect(searchInput).toBeInTheDocument();
    expect(searchModal).toBeInTheDocument();
  });
  it("검색어 입력 시 추천 검색 API 호출", async () => {
    render(<Home />);

    const spyOnSearch = jest.spyOn(remotes, "getSick");
    const searchForm = await screen.findByTestId("search-form");

    userEvent.click(searchForm);

    const searchInput = await screen.findByRole("textbox");

    userEvent.type(searchInput, searchText);

    await delay(200);

    expect(spyOnSearch).toHaveBeenCalled();
  });
  it("추천 검색 API 호출별로 로컬 스토리지에 캐싱정보 저장", async () => {
    render(<Home />);

    const searchForm = await screen.findByTestId("search-form");

    userEvent.click(searchForm);

    const searchInput = await screen.findByRole("textbox");

    userEvent.type(searchInput, searchText);

    await delay(200);

    expect(getLocalStorage(cacheKey)).toBeTruthy();
  });
  it("로컬 스토리지에 만료된 캐싱 정보 삭제", () => {
    const toCacheData = JSON.stringify({
      expireTime: 1,
      data: resMockData,
    });

    localStorage.setItem(cacheKey, toCacheData);

    const isCacheData: boolean = getValidCacheData(cacheKey) !== null;
    expect(isCacheData).toBeFalsy();
  });
  it("검색창 입력마다 추천 검색 API 호출하지 않도록 디바운싱 구현", async () => {
    render(<Home />);
    const spyOnSearch = jest.spyOn(remotes, "getSick");

    const searchForm = await screen.findByTestId("search-form");

    userEvent.click(searchForm);

    const searchInput = await screen.findByRole("textbox");

    userEvent.type(searchInput, "a");
    userEvent.type(searchInput, "b");
    userEvent.type(searchInput, "c");

    await delay(200);

    expect(spyOnSearch).toHaveBeenCalledTimes(1);
  });
  it("키보드로 추천 검색어로 이동", async () => {
    render(<Home />);
    let curUrl: string = "";
    mockedUsedNavigate.mockImplementation((url: string) => {
      curUrl = url;
    });
    const spyOnSearch = jest.spyOn(remotes, "getSick");
    spyOnSearch.mockImplementation(async (): Promise<IResponseSick[]> => {
      return resMockData;
    });
    const searchForm = await screen.findByTestId("search-form");

    userEvent.click(searchForm);

    const searchInput = await screen.findByRole("textbox");

    userEvent.type(searchInput, searchText);

    await delay(500);

    userEvent.keyboard("{arrowdown}");

    await delay(200);

    userEvent.keyboard("[Enter]");

    await delay(200);

    expect(curUrl).toEqual(`/search?q=${resMockData[0].sickNm}`);
  });
});
