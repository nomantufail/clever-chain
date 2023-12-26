import axiosInstance from "./axiosInstance.service";

/**
 * get the full report for selected match
 * @param searchParams
 * @param filters
 * @param page
 * @param recordsPerPage
 * @param sortBy
 * @param jobEntityId
 */
// @ts-ignore
export const fetchMatchReport = (matchId: string) => {
    return axiosInstance.get(`reports/match/${matchId}`, );
}
