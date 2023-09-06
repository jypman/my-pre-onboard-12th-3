import React from "react";
import styled from "styled-components";
import { Icon } from "./Icon";

interface IStyledSearchedKeywordItem {
  onClickItem?: () => void;
  focused?: boolean;
}

interface SearchedKeywordItemProps extends IStyledSearchedKeywordItem {
  label: string;
}

export const SearchedKeywordItem = ({
  label,
  onClickItem,
  focused = false,
}: SearchedKeywordItemProps) => {
  return (
    <StyledSearchedKeywordItem
      className="searched-keyword-item"
      onClick={onClickItem}
      focused={focused}
    >
      <Icon src="/search.svg" color="#A7AFB7" />
      {label}
    </StyledSearchedKeywordItem>
  );
};

const StyledSearchedKeywordItem = styled.div<IStyledSearchedKeywordItem>`
  background-color: ${(props) =>
    props.focused ? "rgb(248, 249, 250)" : "#ffffff"};
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
