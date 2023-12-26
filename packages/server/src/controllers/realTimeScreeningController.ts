// @ts-nocheck
import { NextFunction, Request, Response } from "express";
import SuccessResponse from "src/responses/successResponse";
// @ts-ignore
import * as IndividualScreeningRequest from "interfaces/requests/individualScreeningRequest";
import * as BusinessScreeningRequest from "interfaces/requests/businessScreeningRequest";
import * as ExportCsvRequest from "interfaces/requests/exportCsvRequest";
import { DEFAULT_PAGE_SIZE } from "src/constants";
import realTimeScreeningService from "services/realTimeScreeningService";
import resultsRepository from "src/repositories/resultsRepository";
import reportsRepository from "src/repositories/reportsRepository";
// @ts-ignore
import IIndividualScreeningResponse from "shared/server/types/response/IIndividualScreeningResponse";
import filtersRepository from "src/repositories/filtersRepository";
import { EntityType } from "src/enums";
import * as fastcsv from "fast-csv";
import * as fileSystem from "fs";
import realtimeScanningService from "services/realtimeScanningService";
// @ts-ignore
import realtimeIndividualScreeningResponse from './mockDirectory/realtimeIndividualScreeningResponse';
import realtimeBusinessScreeningResponse from "src/controllers/mockDirectory/realtimeBusinessScreeningResponse";

class RealTimeScreeningController {
  // @ts-ignore
  async getIndividualScreeningResults(request: Request, response: Response, next: NextFunction) {
    try {
      console.log('here....');
      // const params = request.query as unknown as IndividualScreeningRequest.Params;
      // let jobEntityId = params.jobEntityId || '';
      // if (!params.jobEntityId) {
      //   const scanningResponse = await realtimeScanningService.scanRealtimeEntity(params, EntityType.Individual, response.locals.user.customer_id)
      //   jobEntityId = scanningResponse.jobEntityId
      // }
      // const counts = await resultsRepository.getMatchCountsByEntityId(jobEntityId);
      // const totalRecordsWithFilters = await resultsRepository.getResultsCountWithFilters(jobEntityId, params);
      // const results = await realTimeScreeningService.getGivenIndividualMatches(params, jobEntityId);
      // const filtersData = await filtersRepository.getMatchFilters(jobEntityId);
      // response.send(new SuccessResponse<IIndividualScreeningResponse>({
      //   counts,
      //   results: results.rows,
      //   paging: {
      //     nextPage: results.pageState,
      //     totalPages: Math.ceil(totalRecordsWithFilters / (params.recordsPerPage || DEFAULT_PAGE_SIZE)),
      //     totalRecordsAvailable: totalRecordsWithFilters
      //   },
      //   filtersData: filtersData,
      //   jobEntityId
      // }));
      response.send(new SuccessResponse<IIndividualScreeningResponse>(
        realtimeIndividualScreeningResponse as unknown as IIndividualScreeningResponse
      ));
    } catch (e) {
      next(e);
    }
  }

  async getBusinessScreeningResults(request: Request, response: Response, next: NextFunction) {
    try {
      // const params = request.query as unknown as BusinessScreeningRequest.Params;
      // let jobEntityId = params.jobEntityId || '';
      // if (!params.jobEntityId) {
      //   const scanningResponse = await realtimeScanningService.scanRealtimeEntity(params, EntityType.Business, response.locals.user.customer_id)
      //   jobEntityId = scanningResponse.jobEntityId
      // }
      // const totalRecordsWithFilters = await resultsRepository.getResultsCountWithFilters(jobEntityId, params);
      // const counts = await resultsRepository.getMatchCountsByEntityId(jobEntityId);
      // const results = await realTimeScreeningService.getGivenBusinessMatches(params, jobEntityId);
      // const filtersData = await filtersRepository.getMatchFilters(jobEntityId);
      // response.send(new SuccessResponse({
      //   counts,
      //   results: results.rows,
      //   paging: {
      //     nextPage: results.pageState,
      //     totalPages: Math.ceil(totalRecordsWithFilters / (params.recordsPerPage || DEFAULT_PAGE_SIZE)),
      //     totalRecordsAvailable: counts.all
      //   },
      //   filtersData,
      //   jobEntityId
      // }));
      response.send(new SuccessResponse(
        realtimeBusinessScreeningResponse
      ));
    } catch (e) {
      next(e);
    }
  }

  async exportCSVFullReport(request: Request, response: Response, next: NextFunction) {
    try {
      // @ts-ignore
      function flattenObject(ob) {
        var toReturn = {};

        for (var i in ob) {
          if (!ob.hasOwnProperty(i)) continue;

          if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
              if (!flatObject.hasOwnProperty(x)) continue;

              // @ts-ignore
              toReturn[i + '.' + x] = flatObject[x];
            }
          } else {
            // @ts-ignore
            toReturn[i] = ob[i];
          }
        }
        return toReturn;
      }
      const params = request.query as unknown as ExportCsvRequest.Params;
      let matches: any[] = await reportsRepository.getMatchFullReportsByJobEntityId(params.entityId);
      const reports = matches.map(match => flattenObject(JSON.parse(match.full_report)));

      let filename = `results_${(new Date().toJSON().slice(0, 10))}`;
      var ws = fileSystem.createWriteStream(`src/public/${filename}.csv`);
      fastcsv
        .write(reports, { headers: true })
        .on("finish", function() {
          response.send(`<a href="/public/${filename}.csv" download="${filename}.csv" id="download-link"></a><script>document.getElementById('download-link').click(); window.close();</script>`);
        })
        .pipe(ws);
    } catch (e) {
      next(e);
    }
  }

  async exportCSV(request: Request, response: Response, next: NextFunction) {
    try {
      const params = request.query as unknown as ExportCsvRequest.Params;
      let { rows: matches }: any = await resultsRepository.getResultsByJobEntityId(
        params.entityId,
          '',
        {
          pageState: undefined,
          fetchSize: DEFAULT_PAGE_SIZE
        },
        {
          database: "",
          category: "",
          subcategory: "",
          match: "",
          updatedDate: ""
        },
        { column: "match_numeric", order: "desc" }
      );
      matches = matches.map((match: any) => {
        const matchDetails = JSON.parse(match["mapped_entity_details"]);
        const country = matchDetails.country.matchedEntity && `${matchDetails.country.matchedEntity} [${matchDetails.country.matchCriteria}]` || "";
        const city = matchDetails.city.matchedEntity && `${matchDetails.city.matchedEntity} [${matchDetails.city.matchCriteria}]` || "";
        const addr1 = matchDetails.addressLine1.matchedEntity && `${matchDetails.addressLine1.matchedEntity} [${matchDetails.addressLine1.matchCriteria}]` || "";
        if (match.entity_type === "Individual") {
          const dob = matchDetails.dateOfBirth.matchedEntity && `${matchDetails.dateOfBirth.matchedEntity} [${matchDetails.dateOfBirth.matchCriteria}]` || "";
          return {
            "First Name": matchDetails.firstName.matchedEntity || "",
            "Middle Name": matchDetails.middleName.matchedEntity || "",
            "Last Name": matchDetails.lastName.matchedEntity || "",
            "Entity Type": match.entity_type,
            "Database": match.database,
            "Category": match.category,
            "Subcategory": match.subcategory,
            "Match": match.match,
            "Date of Birth": dob,
            "Country": country,
            "City": city,
            "Address line 1": addr1
          };
        } else {
          return {
            "Name": match.name || "",
            "Trading Name": matchDetails.tradingName?.matchedEntity || "",
            "EIN": matchDetails.ein?.matchedEntity || "",
            "Entity Type": match.entity_type,
            "Database": match.database,
            "Category": match.category,
            "Subcategory": match.subcategory,
            "Match": match.match,
            "Country": country,
            "City": city,
            "Address line 1": addr1
          };

        }
      });

      let filename = `results_${(new Date().toJSON().slice(0, 10))}`;
      var ws = fileSystem.createWriteStream(`src/public/${filename}.csv`);
      fastcsv
        .write(matches, { headers: true })
        .on("finish", function() {

          response.send(`<a href="/public/${filename}.csv" download="${filename}.csv" id="download-link"></a><script>document.getElementById('download-link').click(); window.close();</script>`);
        })
        .pipe(ws);
    } catch (e) {
      next(e);
    }
  }
}

const realTimeScreeningController = new RealTimeScreeningController();
export default realTimeScreeningController;
