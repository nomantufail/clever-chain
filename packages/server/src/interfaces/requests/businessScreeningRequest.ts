import { Monitoring } from "shared/enums";

export interface Params {
    name: string,
    registrationNumber?: string,
    addressLine1?: string,
    addressLine2?: string,
    city?: string,
    country?: string,
    county?: string,
    postalCode?: string,

    recordsPerPage?: number,
    page?: string,
    database?: string
    category?: string
    subCategory?: string
    selectedLikliHood?: string
    updatedDate?: string

    jobEntityId?: string
    monitoring?: Monitoring<string>
}
export interface Body {}
