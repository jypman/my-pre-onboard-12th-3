import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SearchedKeywordCard } from "./SearchedKeywordCard";
import { Icon } from "./Icon";
import { useSearchActions, useSearchVals } from "../providers/SearchProvider";

interface SearchFormProps {
  placeHolder?: string;
  onSearch: (searchText: string) => void;
}

export const SearchForm = ({
  placeHolder = "검색어를 입력해주세요.",
  onSearch,
}: SearchFormProps) => {
  const [isFocusSearchForm, setIsFocusSearchForm] = useState<boolean>(false);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { searchText, recommendedData, cachedData } = useSearchVals();
  const { typeSearchedKeyword, initSearchedKeyword } = useSearchActions();

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

  const isNoSearchText = !isFocusSearchForm && searchText.length === 0;

  return (
    <StyledSearchForm ref={searchFormRef} onClick={openSearchedKeywordCard}>
      <div
        className={[
          "search-form-wrapper",
          isFocusSearchForm ? "focus" : "",
        ].join(" ")}
      >
        {isNoSearchText ? (
          <div className="input-placeholder-wrapper">
            <Icon src="/search.svg" color="#A7AFB7" size="16px" />
            <span className="input-placeholder">{placeHolder}</span>
          </div>
        ) : (
          <div className="input-wrapper">
            <input
              autoFocus
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={typeSearchedKeyword}
            />
            {isFocusSearchForm && (
              <div
                className="delete-btn"
                onClick={() =>
                  initSearchedKeyword(() => searchInputRef?.current?.focus())
                }
              >
                <Icon src="/delete.svg" color="#ffffff" size="10px" />
              </div>
            )}
          </div>
        )}

        <div className="search-btn" onClick={() => onSearch(searchText)}>
          <Icon src="/search.svg" color="#ffffff" />
        </div>
      </div>
      {isFocusSearchForm && (
        <div className="searched-keyword-card-wrapper">
          <SearchedKeywordCard
            recommendedData={recommendedData}
            cachedData={cachedData}
            onClickSearchedKeyword={onSearch}
          />
        </div>
      )}
    </StyledSearchForm>
  );
};

const StyledSearchForm = styled.section`
  width: 100%;
  position: relative;
  .search-form-wrapper {
    width: 100%; //
    background-color: #ffffff;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 11px 10px 11px 24px;
    border-radius: 42px;
    border: 2px solid;
    border-color: #ffffff;
    &.focus {
      border-color: #007be9;
    }

    .input-placeholder-wrapper {
      display: flex;
      align-items: center;
      .input-placeholder {
        margin-left: 12px;
        color: #a7afb7;
        cursor: text;
        font-weight: 400;
        font-size: 1.125rem;
      }
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      input {
        width: calc(490px - 120px);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: none;
        border: none;
        font-weight: 400;
        font-size: 1.125rem;
        padding: 0 3px 0 0;
        &:focus {
          outline: none !important;
        }
      }
      .delete-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #a7afb7;
        width: 22px;
        height: 22px;
        border-radius: 100%;
        cursor: pointer;
      }
    }
    .search-btn {
      border-radius: 100%;
      background-color: #007be9;
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .searched-keyword-card-wrapper {
    width: 100%;
    position: absolute;
    margin-top: 8px;
  }
`;
