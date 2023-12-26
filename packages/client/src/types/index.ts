import {SingleValue} from "react-select";

export interface IBusinessScreeningSearchParams {
    name: string,
    registrationNumber?: string,
    addressLine1?: string,
    addressLine2?: string,
    city?: string,
    country?: SingleValue<string>,
    county?: string,
    postalCode?: string,
    monitoring?: string
}

export interface IIndividualScreeningSearchParams {
    firstName: string,
    middleName?: string,
    lastName: string,
    dateOfBirth: string,
    addressLine1?: string,
    addressLine2?: string,
    city?: string,
    country?: SingleValue<string>,
    county?: string,
    postalCode?: string,
    monitoring?: string
}

export interface IScreeningResultsFilters {
    database: string
    category: string,
    subCategory: string,
    selectedLikliHood: string,
    updatedDate: string
}

export interface IJobsFilters {
    startedDate: string
    customerType: string,
}

export interface IJobEntitiesFilters {
    match: string
    database: string,
    category: string,
}

export type {default as IBusinessScreenedResult} from './IBusinessScreenedResult';
export type {default as IIndividualScreenedResult} from './IIndividualScreenedResult';
export type {default as IJob} from './IJob';
export type {default as IJobEntity} from './IJobEntity';
