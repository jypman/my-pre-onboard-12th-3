import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { getSick } from "../api/sick";
import { handleError } from "../api/http";
import { debounce } from "../utils/utils";

export type SearchType = "sick";

interface ISearchVals {
  searchText: string;
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

interface SearchProviderProps {
  searchType: SearchType;
  children: React.ReactElement;
}

const SearchValsCtx = createContext<ISearchVals>({
  searchText: "",
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

export const SearchProvider = ({
  searchType,
  children,
}: SearchProviderProps) => {
  const [isFocusSearchForm, setIsFocusSearchForm] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [recommendedData, setRecommendedData] = useState<string[]>([]);
  const [focusedRecommendSearchItemIndex, setFocusedRecommendSearchItemIndex] =
    useState<number | null>(null);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const submitSearchKeyword = (searchedData: string): void => {
    if (searchedData.length > 0) {
      navigate(`/search?q=${searchedData}`);
    }
  };

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

  useEffect(() => {
    const getUpdatedRecommendedSearchKeywordFocusIndex = (
      event: KeyboardEvent,
    ): number | null => {
      let updateIndex: number | null = focusedRecommendSearchItemIndex;
      if (event.key === "ArrowUp") {
        updateIndex = !updateIndex ? recommendedData.length - 1 : --updateIndex;
      }
      if (event.key === "ArrowDown") {
        updateIndex =
          updateIndex === recommendedData.length - 1 || updateIndex === null
            ? 0
            : ++updateIndex;
      }
      return updateIndex;
    };
    const onKeyboardFocusedRecommendSearchItemIndex = (
      event: KeyboardEvent,
    ): void => {
      if (event.isComposing) return;
      if (event.key === "Enter") return submitSearchKeyword(searchText);
      if (recommendedData.length === 0) return;

      const updateIndex = getUpdatedRecommendedSearchKeywordFocusIndex(event);
      if (updateIndex === focusedRecommendSearchItemIndex) return;

      setFocusedRecommendSearchItemIndex(updateIndex);
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

  const updateSearchList = async (
    searchText: string,
    searchType: SearchType,
  ): Promise<void> => {
    try {
      switch (searchType) {
        case "sick":
          const data = await getSick(searchText);
          const parsedData = data.map((item) => item.sickNm);
          setRecommendedData(parsedData);
          break;
        default:
          break;
      }
    } catch (e) {
      handleError(e);
    }
  };

  const debouncedUpdateSearchList = debounce((searchText: string): void => {
    updateSearchList(searchText, searchType);
  }, 200);

  const typeSearchedKeyword = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setFocusedRecommendSearchItemIndex(null);
    setSearchText(e.target.value);
    debouncedUpdateSearchList(e.target.value);
  };

  const initSearchedKeyword = (callback: Function): void => {
    setRecommendedData([]);
    setSearchText("");
    setFocusedRecommendSearchItemIndex(null);
    callback();
  };

  const searchVals = useMemo<ISearchVals>(
    () => ({
      searchText,
      recommendedData,
      isFocusSearchForm,
      searchFormRef,
      focusedRecommendSearchItemIndex,
    }),
    [
      searchText,
      recommendedData,
      isFocusSearchForm,
      searchFormRef,
      focusedRecommendSearchItemIndex,
    ],
  );

  const searchActions = useMemo<ISearchActions>(
    () => ({
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
