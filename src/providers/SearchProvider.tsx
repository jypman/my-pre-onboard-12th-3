import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getSickList } from "../api/sick";
import { handleError } from "../api/http";
import { debounce } from "../utils";

export type SearchType = "sick";

interface ISearchVals {
  searchText: string;
  cachedData: string[];
  recommendedData: string[];
  isFocusSearchForm: boolean;
  searchFormRef: React.Ref<HTMLDivElement>;
}

interface ISearchActions {
  typeSearchedKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initSearchedKeyword: (callback: Function) => void;
  cacheSearchedData: (searchedData: string) => void;
  openSearchedKeywordCard: () => void;
}

const SearchValsCtx = createContext<ISearchVals>({
  searchText: "",
  cachedData: [],
  recommendedData: [],
  isFocusSearchForm: false,
  searchFormRef: null,
});
const SearchActionsCtx = createContext<ISearchActions>({
  typeSearchedKeyword: () => {},
  initSearchedKeyword: () => {},
  cacheSearchedData: () => {},
  openSearchedKeywordCard: () => {},
});

export const useSearchVals = () => {
  const val = useContext(SearchValsCtx);
  if (val === undefined) {
    throw new Error("useSearchVals should be used within SearchProvider");
  }
  return val;
};

export const useSearchActions = () => {
  const val = useContext(SearchActionsCtx);
  if (val === undefined) {
    throw new Error("useSearchActions should be used within SearchProvider");
  }
  return val;
};

interface SearchProviderProps {
  searchType: SearchType;
  children: React.ReactElement;
}

export const SearchProvider = ({
  searchType,
  children,
}: SearchProviderProps) => {
  const [isFocusSearchForm, setIsFocusSearchForm] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [recommendedData, setRecommendedData] = useState<string[]>([]);
  const [cachedData, setCachedData] = useState<string[]>([]);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const MAX_DATA_LENGTH = 7;

  const cacheKeyPrefix = "CACHED_SEARCH_DATE_";
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const EXPIRED_CACHED_SEARCH_TIME = day * 3;

  const cacheSearchedData = (searchedData: string): void => {
    const cacheKey = `${cacheKeyPrefix}${new Date().getTime().toString()}`;
    window.localStorage.setItem(cacheKey, searchedData);
  };

  const getCacheData = (): string[] => {
    const cachedData: string[] = [];

    Object.keys(window.localStorage).forEach((cacheKey: string) => {
      if (cacheKey.indexOf(cacheKeyPrefix) === -1) return;

      const cachedDate: number = Number(cacheKey.replace(cacheKeyPrefix, ""));
      const now = new Date().getTime();
      if (now > cachedDate + EXPIRED_CACHED_SEARCH_TIME) {
        window.localStorage.removeItem(cacheKey);
        return;
      }
      cachedData.push(window.localStorage.getItem(cacheKey) as string);
    });

    return cachedData;
  };

  useEffect(() => {
    if (isFocusSearchForm) {
      const data = getCacheData();
      setCachedData(data);
    }
  }, [isFocusSearchForm]);

  useEffect(() => {
    const onOutsideClickedSearchForm = (event: MouseEvent): void => {
      if (
        searchFormRef.current &&
        !searchFormRef.current.contains(event.target as Node)
      ) {
        setIsFocusSearchForm(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClickedSearchForm);
    return () => {
      document.removeEventListener("mousedown", onOutsideClickedSearchForm);
    };
  }, [searchFormRef]);

  const openSearchedKeywordCard = () => {
    if (!isFocusSearchForm) setIsFocusSearchForm(true);
  };

  const updateSearchList = async (searchText: string): Promise<void> => {
    try {
      console.info("calling api");
      switch (searchType) {
        case "sick":
          const data = await getSickList(searchText);
          setRecommendedData(
            data.reduce(
              (acc: string[], item) =>
                acc.length < MAX_DATA_LENGTH ? [...acc, item.sickNm] : [...acc],
              [],
            ),
          );
          break;
        default:
          break;
      }
    } catch (e) {
      handleError(e);
    }
  };

  const debouncedUpdateSearchList = debounce((searchText: string): void => {
    updateSearchList(searchText);
  }, 200);

  const typeSearchedKeyword = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchText(e.target.value);
    debouncedUpdateSearchList(e.target.value);
  };

  const initSearchedKeyword = (callback: Function): void => {
    setSearchText("");
    setRecommendedData([]);
    callback();
  };

  const searchVals = useMemo<ISearchVals>(
    () => ({
      searchText,
      cachedData,
      recommendedData,
      isFocusSearchForm,
      searchFormRef,
    }),
    [searchText, cachedData, recommendedData, isFocusSearchForm],
  );

  const searchActions = useMemo<ISearchActions>(
    () => ({
      updateSearchList,
      typeSearchedKeyword,
      initSearchedKeyword,
      cacheSearchedData,
      openSearchedKeywordCard,
    }),
    [],
  );

  return (
    <SearchActionsCtx.Provider value={searchActions}>
      <SearchValsCtx.Provider value={searchVals}>
        {children}
      </SearchValsCtx.Provider>
    </SearchActionsCtx.Provider>
  );
};
