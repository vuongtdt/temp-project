import React from "react";
import { Select } from "@mui/material";
import styled from "styled-components";
//----------------button-------------------
// export default styled.select`
export default styled(({ color, ...otherProps }) => <Select {...otherProps} />)`
  width: 160px;
  height: 50px;
  font-size: 100%;
  font-weight: nomal;
  cursor: pointer;
  border-radius: 0;
  // background-color: ${(props) => props.theme.navColor};
  background-color: transparent;
  // border: 2px solid ${(props) => props.theme.color};
  color: ${(props) => props.theme.color};
  padding: 10px;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* Adding transition effect */
  transition: color 0.3s ease, background-color 0.3s ease,
    border-bottom-color 0.3s ease;
  &:hover {
    // color: ${(props) => props.theme.hoverTextColor};
    // background-color: ${(props) => props.theme.hoverBgColor};
    // border-bottom-color: #dcdcdc;
    // &::before {
    //   border: none !important;
    // }
    &::before {
      border-bottom: 2px solid #fb4226 !important;
    }
  }
  div {
    background-color: transparent !important;
    padding-right: 10px !important;
  }
  svg {
    color: ${(props) => props.theme.color} !important;
  }
  &::before,
  &::after {
    border: none;
  }
  /* width */
  &::-webkit-scrollbar {
    width: 2px !important;
  }
`;
