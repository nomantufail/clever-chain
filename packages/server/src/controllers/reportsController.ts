// @ts-nocheck
import { NextFunction, Request, Response } from "express";
import SuccessResponse from "src/responses/successResponse";
import { ErrorResponse } from "../responses";
import dbService from "shared/services/db.service";
import matchFullReportResponse from "./mockDirectory/matchFullReportResponse";

class ReportsController {
  //@ts-ignore //todo: discard this. no longer needed.
  async getMatchReport(request: Request, response: Response, next: NextFunction) {
    try {
      // const queryWithFilters = `select id, full_report from match_report where id=${request.params.matchId} allow filtering`;
      // // @ts-ignore
      // const resp = await dbService.executeQuery(queryWithFilters )
      // if (resp.rows.length) {
      //   return response.send(new SuccessResponse({ report: JSON.parse(resp.rows[0].full_report) }));
      // } else {
      //   return response.status(400).send(new ErrorResponse('Record not found', 404))
      // }
      return response.send(new SuccessResponse(matchFullReportResponse))
    } catch (e) {
      next(e);
    }
  }
}

const reportsController = new ReportsController();
export default reportsController;
