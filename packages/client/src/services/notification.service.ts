import {toast} from "react-toastify";

export const error = (message: string, options: any = {}) => {
    toast.error(message, options);
}

export const success = (message: string, options: any = {}) => {
    toast.success(message, options);
}

export const warning = (message: string, options: any = {}) => {
    toast.warning(message, options);
}
