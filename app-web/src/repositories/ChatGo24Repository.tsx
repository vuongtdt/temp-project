import { ITags } from 'components/Settings/Tags';
import { LOGIN_URL } from 'models/constants';
import { IInfo } from 'models/messageModel';
import { apiChatGo24 } from '../api';
export const ChatGo24Repository = {
    UpdateStatus: async (userId: string, status: number) => {
        try {
            let path = `/users/me/pages/${userId}`;
            let body = { status }
            const response = await apiChatGo24.patch(path, body);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    GetInfo: async (userId: string) => {
        try {
            let path = `/users/me/pages/${userId}`;
            const response = await apiChatGo24.get(path);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    UpdateConversation: async (userId: string, conversationId: string, data) => {
        try {
            let path = `/users/me/pages/${userId}/conversations/${conversationId}`;
            const response = await apiChatGo24.patch(path, data);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    GetTags: async () => {
        try {
            let path = `/tags`;
            const response = await apiChatGo24.get(path);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    AddTag: async (tag: ITags) => {
        try {
            let path = `/tags`;
            let body = tag;
            const response = await apiChatGo24.post(path, body);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    EditTag: async (tag: ITags) => {
        try {
            let path = `/tags/${tag?.id}`;
            let body = tag;
            const response = await apiChatGo24.patch(path, body);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    DeleteTag: async (id: string) => {
        try {
            let path = `/tags/${id}`;
            const response = await apiChatGo24.delete(path);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    GetConversation: async (conversationId: string, userId: string) => {
        try {
            let path = `/users/me/pages/${userId}/conversations/${conversationId}`;
            const response = await apiChatGo24.get(path);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    AddAddress: async (conversationId: string, userId: string, info: IInfo) => {
        try {
            let path = `/users/me/pages/${userId}/conversations/${conversationId}/addresses`;
            let body = info;
            const response = await apiChatGo24.post(path, body);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    UpdateAddress: async (conversationId: string, userId: string, info: IInfo) => {
        try {
            let path = `/users/me/pages/${userId}/conversations/${conversationId}/addresses/${info.id}`;
            let body = info;
            const response = await apiChatGo24.patch(path, body);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    DeletedAddress: async (conversationId: string, userId: string, info: IInfo) => {
        try {
            let path = `/users/me/pages/${userId}/conversations/${conversationId}/addresses/${info.id}`;
            const response = await apiChatGo24.delete(path);
            return response.data;
        } catch (error: any) {
            if (error?.response?.status === 401) window.location.href = LOGIN_URL;
        }
    },
    FetchConversation(userId: string, conversationId: string) {
        return apiChatGo24.post(`/users/me/pages/${userId}/conversations/${conversationId}/fetch`);
    }
}