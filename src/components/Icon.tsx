import React, { HTMLAttributes, useState, useEffect } from "react";
import styled from "styled-components";

interface IStyledIcon extends HTMLAttributes<HTMLDivElement> {
  size?: string;
  color?: string;
}

interface IconProps extends IStyledIcon {
  src: string;
}

export const Icon = ({ src, size = "16px", color = "black" }: IconProps) => {
  const [iconHTML, setIconHTML] = useState<string | null>(null);

  useEffect(() => {
    fetch(src)
      .then((data) => {
        if (data.ok) return data.text();
        throw new Error();
      })
      .then((iconHTML) => {
        setIconHTML(iconHTML as string);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <StyledIcon
      size={size}
      color={color}
      dangerouslySetInnerHTML={
        typeof iconHTML === "string"
          ? {
              __html: iconHTML,
            }
          : undefined
      }
    />
  );
};

const StyledIcon = styled.div<IStyledIcon>`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    color: ${(props) => props.color};
  }
`;
