import {createContext} from "react";
import IUser from "@cc/shared-service/src/server/types/response/IUser";

export interface IAppContext {
    isAuthenticated: boolean,
    markAsAuthenticated: () => void;
    logout: () => void;
    currentUser?: IUser | null;
    accessToken?: string | null;
}

export const defaultContext: IAppContext = {
    isAuthenticated: false,
    markAsAuthenticated: () => {},
    logout: () => () => {}
}

const AppContext = createContext<IAppContext>(defaultContext);

export default AppContext;
