import {NextFunction, Request, Response} from "express";
import SuccessResponse from "src/responses/successResponse";
import * as AlertsRequest from "interfaces/requests/alertsRequest";
import {DEFAULT_PAGE_SIZE} from "src/constants";
import alertsRepository from "src/repositories/alertsRepository";
import IAlertsResponse from "shared/server/types/response/IAlertsResponse";
import filtersRepository from "src/repositories/filtersRepository";

class AlertsController {
    async getAlerts(request: Request, response: Response, next: NextFunction) {
        try {
            let params: any = request.query as unknown as AlertsRequest.Params;
            params = {...params, customer_id: response.locals.user.customer_id};
            const totalRecordsWithFilters = await alertsRepository.getAlertsCountWithFilters(params);
            const results = await alertsRepository.getAlerts(
                params?.customer_id,
                {
                    pageState: params.page || undefined,
                    fetchSize: params.recordsPerPage || DEFAULT_PAGE_SIZE
                },
                {
                    database: params.database || "",
                    category: params.category || "",
                    subcategory: params.subCategory || "",
                    updatedDate: params.updatedDate || ""
                });
            // const results = await realTimeScreeningService.getGivenIndividualMatches(params, jobEntityId);
            const filtersData = await filtersRepository.getAlertsFilters();
            response.send(new SuccessResponse<IAlertsResponse>({
                results: results.rows,
                paging: {
                    nextPage: results.pageState,
                    totalPages: Math.ceil(totalRecordsWithFilters / (params.recordsPerPage || DEFAULT_PAGE_SIZE)),
                    totalRecordsAvailable: totalRecordsWithFilters
                },
                filtersData: filtersData,
            }));
        } catch (e) {
            next(e);
        }
    }
}

const alertsController = new AlertsController();
export default alertsController;
