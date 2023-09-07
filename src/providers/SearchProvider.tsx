import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
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
  focusedRecommendSearchItemIndex: number | null;
}

interface ISearchActions {
  typeSearchedKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initSearchedKeyword: (callback: Function) => void;
  submitSearchKeyword: (searchedData: string) => void;
  openSearchedKeywordCard: () => void;
}

const SearchValsCtx = createContext<ISearchVals>({
  searchText: "",
  cachedData: [],
  recommendedData: [],
  isFocusSearchForm: false,
  searchFormRef: null,
  focusedRecommendSearchItemIndex: null,
});
const SearchActionsCtx = createContext<ISearchActions>({
  typeSearchedKeyword: () => {},
  initSearchedKeyword: () => {},
  submitSearchKeyword: () => {},
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
  const navigate = useNavigate();
  const MAX_DATA_LENGTH = 7;

  const cacheKeyPrefix = "CACHED_SEARCH_DATE_";
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const EXPIRED_CACHED_SEARCH_TIME = DAY * 3;

  const cacheSearchedData = (searchedData: string): void => {
    const cacheKey = `${cacheKeyPrefix}${new Date().getTime().toString()}`;
    window.localStorage.setItem(cacheKey, searchedData);
  };

  const submitSearchKeyword = (searchedData: string): void => {
    if (searchedData.length > 0) {
      exploreCachedData((cacheKey: string) => {
        deleteDuplicatedCachedData(searchedData, cacheKey);
      });
      cacheSearchedData(searchedData);
      navigate(`/search?q=${searchedData}`);
    }
  };

  const exploreCachedData = (callback: (cacheKey: string) => void) => {
    Object.keys(window.localStorage).forEach((cacheKey: string | undefined) => {
      if (!cacheKey || cacheKey.indexOf(cacheKeyPrefix) === -1) return;
      callback(cacheKey);
    });
  };

  const getSearchedCacheData = (cacheKey: string): string => {
    return window.localStorage.getItem(cacheKey) as string;
  };

  const deleteExpiredSearchedCacheData = (cacheKey: string): void => {
    const cachedDate: number = Number(cacheKey.replace(cacheKeyPrefix, ""));
    const now = new Date().getTime();
    if (now > cachedDate + EXPIRED_CACHED_SEARCH_TIME) {
      window.localStorage.removeItem(cacheKey);
    }
  };

  const deleteDuplicatedCachedData = (
    searchedData: string,
    cacheKey: string,
  ): void => {
    if (searchedData === getSearchedCacheData(cacheKey)) {
      window.localStorage.removeItem(cacheKey);
    }
  };

  useEffect(() => {
    const updateSearchedCacheData = () => {
      if (isFocusSearchForm) {
        const cachedData: string[] = [];
        exploreCachedData((cacheKey: string) => {
          deleteExpiredSearchedCacheData(cacheKey);
          cachedData.push(getSearchedCacheData(cacheKey));
        });
        setCachedData(cachedData);
      }
    };

    updateSearchedCacheData();
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

  const [focusedRecommendSearchItemIndex, setFocusedRecommendSearchItemIndex] =
    useState<number | null>(null);

  useEffect(() => {
    const onKeyboardFocusedRecommendSearchItemIndex = (
      event: KeyboardEvent,
    ): void => {
      if (event.isComposing) return;
      if (event.key === "Enter") {
        return submitSearchKeyword(searchText);
      }
      if (recommendedData.length === 0) return;

      let updateIndex: number | null = focusedRecommendSearchItemIndex;
      if (event.key === "ArrowUp") {
        updateIndex =
          updateIndex === 0 || updateIndex === null
            ? recommendedData.length - 1
            : --updateIndex;
      }
      if (event.key === "ArrowDown") {
        updateIndex =
          (typeof updateIndex === "number" &&
            updateIndex + 1 === recommendedData.length) ||
          updateIndex === null
            ? 0
            : ++updateIndex;
      }
      if (updateIndex === focusedRecommendSearchItemIndex) return;

      setFocusedRecommendSearchItemIndex(() => updateIndex);
      setSearchText(
        recommendedData.find((_, index: number) => index === updateIndex) ?? "",
      );
    };
    document.addEventListener(
      "keydown",
      onKeyboardFocusedRecommendSearchItemIndex,
    );
    return () => {
      document.removeEventListener(
        "keydown",
        onKeyboardFocusedRecommendSearchItemIndex,
      );
    };
  }, [recommendedData, focusedRecommendSearchItemIndex, searchText]);

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
    setFocusedRecommendSearchItemIndex(null);
    setSearchText(e.target.value);
    debouncedUpdateSearchList(e.target.value);
  };

  const initSearchedKeyword = (callback: Function): void => {
    setSearchText("");
    setRecommendedData([]);
    setFocusedRecommendSearchItemIndex(null);
    callback();
  };

  const searchVals = useMemo<ISearchVals>(
    () => ({
      searchText,
      cachedData,
      recommendedData,
      isFocusSearchForm,
      searchFormRef,
      focusedRecommendSearchItemIndex,
    }),
    [
      searchText,
      cachedData,
      recommendedData,
      isFocusSearchForm,
      searchFormRef,
      focusedRecommendSearchItemIndex,
    ],
  );

  const searchActions = useMemo<ISearchActions>(
    () => ({
      updateSearchList,
      typeSearchedKeyword,
      initSearchedKeyword,
      submitSearchKeyword,
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
