import { Repository } from "./repository";
import IScreenedResult from "shared/server/types/response/partials/IScreenedResult";
import { QueryOptions } from "cassandra-driver";
import { IFilters } from "interfaces/common";
import * as constants from "../constants";
import dbService from "shared/services/db.service";

// import * as IndividualScreeningRequest from "interfaces/requests/individualScreeningRequest";

export class ResultsRepository extends Repository {
  constructor() {
    super();
  }

  _buildJobResultsQueryFromParams(jobEntityId: string, customerId: string, filters: IFilters, sortBy: null | { column: string, order: string }, count: boolean = false) {
    const sortByQueryPart = sortBy ? `order by ${sortBy.column} ${sortBy.order}` : '';
    const filterByCustomerId = customerId ? `and customer_id=${customerId}` : '';
    let query = `select ${count ? 'Count(*) ': ' id, job_id, job_entity_id, updated_at, database, category, subcategory, match, match_description, name, entity_type, mapped_entity_details, bridger_updated, comments'} from job_results where job_entity_id=${jobEntityId} ${filterByCustomerId} and constant_val='${constants.DB_CONSTANT_VAL}'`;
    if (filters.database) {
      query += ` AND database='${filters.database}'`;
    }
    if (filters.match) {
      query += ` AND match='${filters.match}'`;
    }
    if (filters.category) {
      query += ` AND category='${filters.category}'`;
    }
    if (filters.subcategory) {
      query += ` AND subcategory='${filters.subcategory}'`;
    }
    if (filters.updatedDate) {
      query += ` AND bridger_updated>='${filters.updatedDate}'`;
    }
    return `${query} ${sortByQueryPart} ALLOW FILTERING`;
  }

  /**
   * this method get list of results by job entity id
   * @param jobEntityId
   * @param paging
   * @param filters
   * @param sortBy
   * @param customerId
   */
  async getResultsByJobEntityId(
    jobEntityId: string,
    customerId: string,
    paging: { pageState: string | undefined, fetchSize: number } | undefined,
    filters: IFilters,
    sortBy: null | { column: string, order: string }
  ) {
    const options: QueryOptions = {};
    if (paging) {
      options.prepare = true;
      options.pageState = paging.pageState;
      options.fetchSize = paging.fetchSize;
    }
    const queryWithFilters = this._buildJobResultsQueryFromParams(jobEntityId, customerId, filters, sortBy);
    const resp = await dbService.executeQuery(queryWithFilters, {}, options);
    return { rows: resp.rows as unknown as IScreenedResult[], pageState: resp.pageState };
  }

  /**
   * this method get list of results by job entity id
   * @param jobEntityId
   */
  async getMatchCountsByEntityId(jobEntityId: string) {
    const exactMatchCountQuery = `select COUNT(*) from job_results where match='Exact' AND job_entity_id=${jobEntityId} Allow filtering`;
    const veryHighMatchCountQuery = `select COUNT(*) from job_results where match='Very High' AND job_entity_id=${jobEntityId} Allow filtering`;
    const highMatchCountQuery = `select COUNT(*) from job_results where match='High' AND job_entity_id=${jobEntityId} Allow filtering`;
    const mediumMatchCountQuery = `select COUNT(*) from job_results where match='Medium' AND job_entity_id=${jobEntityId} Allow filtering`;
    const lowMatchCountQuery = `select COUNT(*) from job_results where match='Low' AND job_entity_id=${jobEntityId} Allow filtering`;
    const veryLowMatchCountQuery = `select COUNT(*) from job_results where match='Very Low' AND job_entity_id=${jobEntityId} Allow filtering`;
    const allMatchCountQuery = `select COUNT(*) from job_results where job_entity_id=${jobEntityId} Allow filtering`;
    const resp = await Promise.all([
      dbService.executeQuery(exactMatchCountQuery),
      dbService.executeQuery(veryHighMatchCountQuery),
      dbService.executeQuery(highMatchCountQuery),
      dbService.executeQuery(mediumMatchCountQuery),
      dbService.executeQuery(lowMatchCountQuery),
      dbService.executeQuery(veryLowMatchCountQuery),
      dbService.executeQuery(allMatchCountQuery)
    ]);
    return {
      exact: parseInt(resp[0].rows[0].count),
      veryHigh: parseInt(resp[1].rows[0].count),
      high: parseInt(resp[2].rows[0].count),
      medium: parseInt(resp[3].rows[0].count),
      low: parseInt(resp[4].rows[0].count),
      veryLow: parseInt(resp[5].rows[0].count),
      all: parseInt(resp[6].rows[0].count)
    };
  }

  async getResultsCountWithFilters(jobEntityId: string, params: any) {
    const queryWithFilters = this._buildJobResultsQueryFromParams(jobEntityId, params.customer_id,{
        database: params.database || "",
        category: params.category || "",
        subcategory: params.subCategory || "",
        match: params.selectedLikliHood || "",
        updatedDate: params.updatedDate || ""
      }, null, true
    );
    const resp = await dbService.executeQuery(queryWithFilters);
    return parseInt(resp.rows[0].count);
  }
}

const resultsRepository = new ResultsRepository();
export default resultsRepository;
