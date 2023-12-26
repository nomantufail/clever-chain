import IUser from "shared/server/types/response/IUser";

export interface Params {
    recordsPerPage?: number,
    page?: string
    category?: string
    database?: string
    match?: string,
    user?: IUser
}
export interface Body {}
