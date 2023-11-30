import styled from "styled-components";
import Grid from "@mui/material/Grid";

export const GridNav = styled(Grid)`
  background-color: ${(props) => props.theme.navColor};
  color: ${(props) => props.theme.color};
  padding: 0;
  margin-right: auto;
  margin-left: auto;
`;

export const GridBG = styled(Grid)`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  padding: 0 50px;
  margin-right: auto;
  margin-left: auto;
`;

export const GridSide = styled(Grid)`
  background-color: ${(props) => props.theme.color};
  color: ${(props) => props.theme.color};
  padding: 0;
  margin-right: auto;
  margin-left: auto;
`;
export const GridBorder = styled(Grid)`
  border-bottom: 1px dashed ${(props) => props.theme.borderColor};
`;
