import React from "react";
import styled from "styled-components";
import { Icon } from "./Icon";

interface SearchedKeywordItemProps {
  label: string;
  onClickItem?: () => void;
}

export const SearchedKeywordItem = ({
  label,
  onClickItem,
}: SearchedKeywordItemProps) => {
  return (
    <StyledSearchedKeywordItem
      className="searched-keyword-item"
      onClick={onClickItem}
    >
      <Icon src="/search.svg" color="#A7AFB7" />
      {label}
    </StyledSearchedKeywordItem>
  );
};

const StyledSearchedKeywordItem = styled.div`
  width: 100%;
  &:hover {
    background-color: rgb(248, 249, 250);
  }
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: -0.018em;
  line-height: 1.6;
  padding: 8px 24px;
  cursor: pointer;
`;
