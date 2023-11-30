import axios from "axios";
import config from "../config";
export const apiChatGo24 = axios.create({
  baseURL: config.baseUrl,
}) as any;

export const apiGo24 = axios.create({
  baseURL: config.apiGo24Url,
}) as any;
