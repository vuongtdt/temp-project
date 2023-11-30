import { LOGIN_URL } from "models/constants";
import { apiGo24, apiChatGo24 } from "../api"

export const apiGetChatGo24 = (url, callback) => {
    apiChatGo24.get(url).then(callback).catch(err => {
        if(err?.response?.status === 401)
        {
            window.location.href = LOGIN_URL;
        }
    })
}
export const apiPostChatGo24 = (url, data, callback ) => {
    apiChatGo24.post(url, data).then(callback).catch(err => {
        if(err?.response?.status === 401)
        {
            window.location.href = LOGIN_URL;
        }
    })
}

export const apiDeleteChatGo24 = (url, callback) => {
    apiChatGo24.delete(url).then(callback).catch(err => {
        if(err?.response?.status === 401)
        {
            window.location.href = LOGIN_URL
        }
    })
}

export const apiPatchChatGo24 = (url, data, callback) => {
    apiChatGo24.patch(url, data).then(callback).catch(err => {
        if(err?.response?.status === 401)
        {
            window.location.href = LOGIN_URL;
        }
    })
}


export const apiGetGo24 = (url, callback) => {
    apiGo24.get(url).then(callback).catch(err => {
        if(err?.response?.status === 401)
        {
            window.location.href = LOGIN_URL;
        }
    })
}
export const apiPostGo24 = (url, data, callback ) => {
    apiGo24.post(url, data).then(callback).catch(err => {
        if(err?.response?.status === 401)
        {
            window.location.href = LOGIN_URL;
        }
    })
}