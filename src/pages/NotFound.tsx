import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <StyledNotFound>
      <div className="text-content">
        <div>페이지를 찾을 수 없었어요 ㅠㅠ</div>
        <div className="url-back-btn" onClick={() => navigate(-1)}>
          뒤로 가기
        </div>
      </div>
    </StyledNotFound>
  );
};

const StyledNotFound = styled.main`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;

  font-weight: 700;
  font-size: 30px;

  .text-content {
    text-align: center;
    .url-back-btn {
      margin-top: 10px;
      cursor: pointer;
      &:hover {
        color: green;
      }
    }
  }
`;
