import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { getSickList } from "../api/sick";
import { handleError } from "../api/http";

export type SearchType = "sick";

interface ISearchVals {
  searchText: string;
  cachedData: string[];
  recommendedData: string[];
}

interface ISearchActions {
  typeSearchedKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initSearchedKeyword: (callback: Function) => void;
}

const SearchValsCtx = createContext<ISearchVals>({
  searchText: "",
  cachedData: [],
  recommendedData: [],
});
const SearchActionsCtx = createContext<ISearchActions>({
  typeSearchedKeyword: () => {},
  initSearchedKeyword: () => {},
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
  const [searchText, setSearchText] = useState<string>("");
  const [recommendedData, setRecommendedData] = useState<string[]>([]);
  const [cachedData, setCachedData] = useState<string[]>([]);
  const MAX_DATA_LENGTH = 7;

  const updateSearchList = async (searchText: string) => {
    try {
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

  const typeSearchedKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
      updateSearchList(e.target.value);
    },
    [],
  );

  const initSearchedKeyword = useCallback((callback: Function) => {
    setSearchText("");
    callback();
  }, []);

  const searchVals = useMemo<ISearchVals>(
    () => ({ searchText, cachedData, recommendedData }),
    [searchText, cachedData, recommendedData],
  );

  const searchActions = useMemo<ISearchActions>(
    () => ({
      updateSearchList,
      typeSearchedKeyword,
      initSearchedKeyword,
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
