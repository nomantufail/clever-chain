import IUser from "shared/server/types/response/IUser";

export interface Params {
    recordsPerPage?: number,
    page?: string
    startedDate?: string
    customerType?: string
    user?: IUser
}
export interface Body {}
