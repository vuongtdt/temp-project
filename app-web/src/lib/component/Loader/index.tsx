import React from "react";
import "./style.scss";
import styled from "styled-components";

export const Loading =  styled(({ color, ...otherProps }) => <div {...otherProps} />)`
border: 16px solid #f3f3f3;
border-radius: 50%;
border-top: 16px solid ${(props: any) => (props?.primary ? "#2373fd" : "red")};
width: 120px;
height: 120px;
-webkit-animation: spin 2s linear infinite; /* Safari */
animation: spin 2s linear infinite;
`;

export default function Loader() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loading primary={true}></Loading>
    </div>
  );
}
