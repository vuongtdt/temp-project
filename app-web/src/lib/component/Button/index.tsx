import React from "react";
import styled from "styled-components";
import { Button } from '@mui/material'
//----------------button-------------------

export default styled(({ color, ...otherProps }) => <Button {...otherProps} />)`
  apperance: none;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  border: ${(props) => props.theme.borderButton};
  padding: 0.25em 0.5em;
  transition: all 0.5s;
  font-size: 15px;

  &:hover {
    color: ${(props) => props.theme.navColor};
    background-color:  ${(props) => props.theme.noteColor};
    // background-color: ${(props) => props.theme.hoverBgColor};
    border: ${(props) => props.theme.borderButton};
  }
`;
