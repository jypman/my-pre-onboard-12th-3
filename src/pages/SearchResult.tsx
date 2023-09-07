import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

export const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchedKeyword = decodeURI(location.search.replace("?q=", ""));

  return (
    <StyledSearchResult>
      <h1>검색어</h1>
      <div className="search-result-wrapper">
        <h3>{searchedKeyword}</h3>
        <button onClick={() => navigate("/")}>홈페이지로 이동</button>
      </div>
    </StyledSearchResult>
  );
};

const StyledSearchResult = styled.main`
  h1 {
    text-align: center;
  }
  .search-result-wrapper {
    width: fit-content;
    margin: 0 auto;
    text-align: center;

    button {
      margin-top: 20px;
      cursor: pointer;
    }
  }
`;
