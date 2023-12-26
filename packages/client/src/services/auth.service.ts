import axiosInstance from "./axiosInstance.service";
import IUser from "@cc/shared-service/src/server/types/response/IUser";

export const getJwtToken = () => {
    const token = localStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
}

export const setJwtToken = (token: string) => {
    return localStorage.setItem('access_token', token);
}

/**
 * calls the api to authenticate the credentials
 * @param credentials
 */
export const authenticateUser = (credentials: { username: string, password: string}) => {
    return axiosInstance.post('login', credentials);
}

/**
 * calls the api to logout the user
 */
export const logout = () => {
    return axiosInstance.get('logout');
}

export const persistCurrentUser = (user: IUser) => {
    return localStorage.setItem('current_user', JSON.stringify(user));
}

export const deletePersistedCurrentUser = () => {
    return localStorage.removeItem('current_user')
}

export const getCurrentUser = (): IUser | null => {
    if (localStorage.getItem('current_user')) {
        return JSON.parse(localStorage.getItem('current_user')!);
    } else {
        return null;
    }
}
