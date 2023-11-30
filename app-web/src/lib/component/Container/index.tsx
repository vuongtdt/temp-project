import styled from "styled-components";

export const ContainerFluid = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  border: 5px solid ${(props) => props.theme.color};
  padding: 15px;
  margin-right: auto;
  margin-left: auto;
`;

export const Container = styled.div`
  background-color: ${(props) => props.theme.navColor};
  color: ${(props) => props.theme.color};
  height: 100%;
  // border-radius: 8px;
  width: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  // border: solid 1px ${(props) => props.theme.borderColor};
  transform: translate(-50%, -50%);
  // @media screen and (max-width: 1700px) {
  //   height: 95%;
  //   width: 98%;
  // }
`;

export const ContainerNav = styled.div`
  background-color: ${(props) => props.theme.navColor};
  color: ${(props) => props.theme.color};
  padding: 0;
  margin-right: auto;
  margin-left: auto;
`;

export const ContainerBG = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  padding: 0;
  margin: auto;
  height: 100vh;
  width: 100%;
  position: relative;
`;

export const ContainerSide = styled.div`
  background-color: ${(props) => props.theme.color};
  padding: 0;
  margin-right: auto;
  margin-left: auto;
`;