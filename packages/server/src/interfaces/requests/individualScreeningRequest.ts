import { Monitoring } from "shared/enums";

export interface Params {
    firstName: string,
    middleName?: string,
    lastName: string,
    dateOfBirth: string,
    addressLine1?: string,
    addressLine2?: string,
    city?: string,
    country?: '',
    county?: string,
    postalCode?: string,

    recordsPerPage?: number,
    page?: string
    database?: string
    category?: string
    subCategory?: string
    updatedDate?: string
    selectedLikliHood?: string

    jobEntityId?: string
    monitoring?: Monitoring<string>
}
export interface Body {}
