import axiosInstance from "./axiosInstance.service";
import {
    IIndividualScreenedResult,
    IIndividualScreeningSearchParams,
    IJobsFilters,
    IScreeningResultsFilters
} from "src/types";
import { EntityType, JobStatus } from "src/enums";

/**
 * Screen the given business
 * @param searchParams
 * @param filters
 * @param page
 * @param recordsPerPage
 * @param sortBy
 * @param jobEntityId
 */
// @ts-ignore
export const screenBusiness = (searchParams, filters, page, recordsPerPage, sortBy, jobEntityId: string) => {
    return axiosInstance.get('screen/business', {
        params: {
            ...searchParams,
            ...filters,
            page,
            recordsPerPage,
            sortBy,
            jobEntityId
        }
    });
}

/**
 * Screen the given individual
 * @param searchParams
 * @param filters
 * @param page
 * @param recordsPerPage
 * @param sortBy
 * @param jobEntityId
 */
export const screenIndividual = (searchParams: IIndividualScreeningSearchParams, filters: IScreeningResultsFilters, page: string, recordsPerPage: number, sortBy: string, jobEntityId: string) => {
    return axiosInstance.get('screen/individual', {
        params: {
            ...searchParams,
            ...filters,
            page,
            recordsPerPage,
            sortBy,
            jobEntityId
        }
    });
}

/**
 * this function starts batch screening in the background process
 * @param formData
 * @param fileUploadProgressTracker
 */
// @ts-ignore
export const startBatchScreening = (formData: FormData, fileUploadProgressTracker: (progress: number) => void) => {
    return axiosInstance.post('screen/batch', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
            fileUploadProgressTracker(Math.round((100 * data.loaded) / data.total))
        }
    });
}

// @ts-ignore
export const fetchJobs = (filters: IJobsFilters, page: string, recordsPerPage: number, sortBy: string) => {
    return axiosInstance.get('jobs', {
        params: {
            ...filters,
            page,
            recordsPerPage,
            sortBy
        }
    });
}
/**
 * This function get the job entities already screened via backend service
 * @param jobId
 * @param filters
 * @param page
 * @param recordsPerPage
 */
// @ts-ignore
export const getJobEntities = (jobId, filters, page, recordsPerPage) => {
    return axiosInstance.get(`jobs/${jobId}`, {
        params: {
            ...filters,
            page,
            recordsPerPage,
        }
    });
}

/**
 * This function get already screened matches from backend.
 * @param jobId
 * @param entityId
 * @param filters
 * @param page
 * @param recordsPerPage
 * @param sortBy
 */
// @ts-ignore
export const getScreenedJobMatches = (jobId, entityId, filters, page, recordsPerPage, sortBy) => {
    return axiosInstance.get(`jobs/${jobId}/matches/${entityId}`, {
        params: {
            ...filters,
            page,
            recordsPerPage,
            sortBy
        }
    });
}

export const downloadCsv = (jobEntityId: string) => {
    return axiosInstance.get(`export/csv/?entityId=${jobEntityId}`)
}
