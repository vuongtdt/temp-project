import { ResultCode, ResultModel } from 'models/apiResonseModel';
import { LOGIN_URL } from 'models/constants';
import { apiGo24 } from '../api';
export const Go24Repository = {
    GetOrderDetail: async (orderId) => {
        try {
            let path = `/shop/order/get?id=${orderId}`;
            const response = await apiGo24.get(path);
            return response.data;
        } catch (error: any) {
            return error?.message;
        }
    },
    GetDeliveries: async () => {
        try {
            let path = `/DeliveryPartner/gets`;
            const response = await apiGo24.get(path);
            if (response?.data?.code === 'Fail' && response?.data?.errorMessage === 'Không đủ quyền truy cập') {
                window.location.href = LOGIN_URL;
            }
            return response.data;
        } catch (error: any) {
            return error?.message;
        }
    },
    GetsPhoneNumber: async (phoneNumber: string = '') => {
        try {
            let path = `/customer/gets-by-phone?phoneNumber=${phoneNumber}`;
            const response = await apiGo24.get(path);
            if (response?.data?.code === 'Fail' && response?.data?.errorMessage === 'Không đủ quyền truy cập') {
                window.location.href = LOGIN_URL;
            }
            return response.data;
        } catch (error: any) {
            return error?.message;
        }
    },
    ReOrder: async (orderId: number) => {
        try {
            let path = `/order/re-order`;
            const response = await apiGo24.post(path, { orderId });
            return response.data;
        } catch (error: any) {
            return error?.message;
        }
    },
    CancelOrder: async (orderId: number) => {
        try {
            let path = `/order/cancel`;
            const response = await apiGo24.post(path, { orderId });
            return response.data;
        } catch (error: any) {
            return error?.message;
        }
    },
    SendOrderRequest: async (data: any) => {
        try {
            let path = `/orderrequest/add`;
            const response = await apiGo24.post(path, data);
            return response.data;
        } catch (error: any) {
            return error?.message;
        }
    },
    DetachAddress: async (address: string = '') => {
        try {
            let path = `/detachaddress/detach-address?address=${encodeURIComponent(address)}`;
            const response = await apiGo24.get(path);
            return response.data;
        } catch (error: any) {
            return error?.message;
        }
    },
    login: async (username: string, password: string, isRememberMe: boolean, reCaptchaToken: string): Promise<ResultModel<LoginResponse>> => {
        try {
            const path = '/Authen/login';
            const response = await apiGo24.post(path, {username, password,isRememberMe, token: reCaptchaToken});
            return response.data as ResultModel<LoginResponse>;
        } catch (error: any) {
            return error?.message;
        }
    },
    checkLogin: async (accessToken: string) => {
        try {
          const path = "/Authen/checklogin";
          const response = await apiGo24.get(path, { params: { accessToken } });          
          if (response.data.result === ResultCode.Success) {    
            return response.data as ResultModel<LoginResponse>;
          }
        } catch { }
        return false;
    },
    logout: (accessToken: string): Promise<never> => {
        const path = "/Authen/logout";
        return apiGo24.post(path, {}, {headers: {
            AccessToken: accessToken
        }});
    }
}

class LoginResponse {
    accessToken: string;
    email: string;
    fullName: string;
    imageUrl: string;
    roles: number[];
}
