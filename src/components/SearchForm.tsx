import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SearchedKeywordCard } from "./SearchedKeywordCard";
import { Icon } from "./Icon";
import { ISearch } from "../types";

interface SearchFormProps {
  placeHolder?: string;
  onFocusSearchForm?: () => void;
  onClickSearchStrDeleteBtn?: (sickText: string) => void;
  onInputSearchForm: (sickText: string) => void;
  onSearch: (sickText: string) => void;
}

export const SearchForm = ({
  placeHolder = "검색어를 입력해주세요.",
  onFocusSearchForm,
  onInputSearchForm,
  onSearch,
  onClickSearchStrDeleteBtn,
}: SearchFormProps) => {
  const [isFocusSearchForm, setIsFocusSearchForm] = useState<boolean>(false);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [sickText, setSickText] = useState<string>("");

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
    if (onFocusSearchForm) onFocusSearchForm();
    if (!isFocusSearchForm) setIsFocusSearchForm(true);
  };

  const isNoSearchText = !isFocusSearchForm && sickText.length === 0;

  const typeSearchedKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputSearchForm(e.target.value);
    setSickText(e.target.value);
  };

  const initSearchedKeyword = (sickText: string) => {
    if (onClickSearchStrDeleteBtn) onClickSearchStrDeleteBtn(sickText);
    setSickText("");
    searchInputRef?.current?.focus();
  };

  return (
    <StyledSearchForm ref={searchFormRef} onClick={openSearchedKeywordCard}>
      <div
        className={[
          "search-form-wrapper",
          isFocusSearchForm ? "focus" : "",
        ].join(" ")}
      >
        {isNoSearchText ? (
          <div className="sick-input-placeholder-wrapper">
            <Icon src="/search.svg" color="#A7AFB7" size="16px" />
            <span className="sick-input-placeholder">{placeHolder}</span>
          </div>
        ) : (
          <div className="sick-input-wrapper">
            <input
              autoFocus
              ref={searchInputRef}
              type="text"
              value={sickText}
              onChange={typeSearchedKeyword}
            />
            {isFocusSearchForm && (
              <div
                className="delete-btn"
                onClick={() => initSearchedKeyword(sickText)}
              >
                <Icon src="/delete.svg" color="#ffffff" size="10px" />
              </div>
            )}
          </div>
        )}

        <div className="search-btn" onClick={() => onSearch(sickText)}>
          <Icon src="/search.svg" color="#ffffff" />
        </div>
      </div>
      <div className="searched-keyword-card-wrapper">
        <SearchedKeywordCard
          recommendedSearchKeywordList={[{ sickNm: "병", sickCd: "0" }]}
          cachedSearchKeywordList={[{ sickNm: "병", sickCd: "0" }]}
          onClickSearchedKeyword={onSearch}
        />
      </div>
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

    .sick-input-placeholder-wrapper {
      display: flex;
      align-items: center;
      .sick-input-placeholder {
        margin-left: 12px;
        color: #a7afb7;
        cursor: text;
        font-weight: 400;
        font-size: 1.125rem;
      }
    }

    .sick-input-wrapper {
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
