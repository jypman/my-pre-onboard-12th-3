import React from "react";
import styled from "styled-components";
import { SearchForm } from "../components/SearchForm";

export const Home = () => {
  return (
    <StyledHome>
      <div className="home-banner">
        <h2>
          국내 모든 임상시험 검색하고
          <br />
          온라인으로 참여하기
        </h2>
        <div className="search-form-wrapper">
          <SearchForm
            placeHolder="질환명을 입력해주세요."
            onFocusSearchForm={() => {}}
            onSearch={() => {}}
            onInputSearchForm={() => {}}
            onClickSearchStrDeleteBtn={() => {}}
          />
        </div>
      </div>
    </StyledHome>
  );
};

const StyledHome = styled.div`
  width: 100%;
  .home-banner {
    background-color: #cae9ff;
    padding: 80px 0 160px;
    h2 {
      text-align: center;
    }
    .search-form-wrapper {
      margin: 0 auto;
      width: 490px;
    }
  }
`;
