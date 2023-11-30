import {apiChatGo24, apiGo24} from "../api";

export const setHeadersChatGo24 = (token) => {
  if (token) {
    apiChatGo24.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else if (apiChatGo24.default) {
    delete apiChatGo24.default.headers.common["Authorization"];
  }
};

export const setHeadersGo24 = (token) => {
  if (token) {
    apiGo24.defaults.headers.common["AccessToken"] = `${token}`;
  } else if (apiGo24.default) {
    delete apiGo24.default.headers.common["Authorization"];
  }
};