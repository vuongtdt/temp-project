import React from "react";
import { TextField, FormLabel } from "@mui/material";
import styled from "styled-components";
export const Input = styled.input`
  border: 1px solid ${(props) => props.theme.color};
  min-height: 35px;
  height: 35px;
  font-size: 17px;
  width: auto;
  display: initial;
`;

export const Label = styled.span`
  color: ${(props) => props.theme.color};
  width: auto;
`;
export const LabelM = styled(FormLabel)`
  color: ${(props) => props.theme.color};
`;
export const TextFieldB = ({ label, ...props }: any) => {
  return (
    <span>
      <Label>{label}</Label>
      <br></br>
      <Input {...props} />
    </span>
  );
};

export const TextFieldM = styled(TextField)`
  border: 1px solid ${(props) => props.theme.color};
  & div,
  label {
    color: ${(props) => props.theme.color};
  }
  // min-height: 35px;
  // height: 35px;
  // font-size: 17px;
  // width: auto;
  // display: initial;
`;
