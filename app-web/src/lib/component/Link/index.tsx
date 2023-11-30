import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";
// export const Link = (props) => {
//     return <a className={props.className}>
//         {props.children}
//     </a>
// };
// let {className,children} = props;

export const SLink = ({ className, children, ...resprops }: any) => (
  <a className={className} {...resprops}>
    {children}
  </a>
);

export const StyledLink = styled(SLink)`
  color: ${(props) => props.theme.color};
  &:hover {
    color: #fb4226;
    text-decoration: none;
    cursor: pointer;
  }
`;
export const StyledLinkPage = styled(Link)`
  //   background-color: red;
  //   font-weight: bold;
  color: ${(props) => props.theme.color};
  &:hover {
    color: #fb4226;
    text-decoration: none;
    cursor: pointer;
  }
`;
