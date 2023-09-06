import React from "react";
import styled from "styled-components";

interface IStyledBadge {
  color?: string;
  backgroundcolor?: string;
}

interface BadgeProps extends IStyledBadge {
  label: string | React.ReactElement;
  onClickBadge: () => void;
}

export const Badge = ({
  label,
  onClickBadge,
  backgroundcolor = "rgb(238, 248, 255)",
  color = "rgb(0, 123, 233)",
}: BadgeProps) => {
  return (
    <StyledBadge
      backgroundcolor={backgroundcolor}
      color={color}
      onClick={onClickBadge}
    >
      {label}
    </StyledBadge>
  );
};

const StyledBadge = styled.div<IStyledBadge>`
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: -0.018em;
  line-height: 1.6;
  cursor: pointer;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.color};
  padding: 8px 16px;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
  border-radius: 20px;
`;
