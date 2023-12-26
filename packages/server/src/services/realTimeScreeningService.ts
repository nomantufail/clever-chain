import * as IndividualScreeningRequest from "interfaces/requests/individualScreeningRequest";
import * as BusinessScreeningRequest from "interfaces/requests/businessScreeningRequest";
import resultsRepository from "src/repositories/resultsRepository";
import { DEFAULT_PAGE_SIZE } from "src/constants";

class RealTimeScreeningService {
  constructor() {
  }

  async getMatchesByEntityId(jobEntityId: string, params: any) {
    if (!jobEntityId) {
      throw Error("Entity does not exists.");
    }
    return resultsRepository.getResultsByJobEntityId(
      jobEntityId,
      params?.user?.customer_id,
      {
        pageState: params.page || undefined,
        fetchSize: params.recordsPerPage || DEFAULT_PAGE_SIZE
      },
      {
        database: params.database || "",
        category: params.category || "",
        subcategory: params.subCategory || "",
        match: params.selectedLikliHood || "",
        updatedDate: params.updatedDate || ""
      },
      {
        column: 'match_numeric',
        order: params.sortBy ? params.sortBy.split('|')[1] : 'desc'
      }
    );
  }

  async getGivenIndividualMatches(params: IndividualScreeningRequest.Params, jobEntityId: string) {
    return this.getMatchesByEntityId(jobEntityId, params)
  }

  async getGivenBusinessMatches(params: BusinessScreeningRequest.Params, jobEntityId: string) {
    return this.getMatchesByEntityId(jobEntityId, params)
  }
}

const realTimeScreeningService = new RealTimeScreeningService();
export default realTimeScreeningService;
