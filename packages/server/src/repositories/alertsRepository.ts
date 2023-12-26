import { Repository } from "./repository";
import { QueryOptions } from "cassandra-driver";
import {IAlertsFilter} from "interfaces/common";
import * as constants from "../constants";
import dbService from "shared/services/db.service";
import IAlertsResult from "shared/server/types/response/partials/IAlertsResult";

export class ResultsRepository extends Repository {
  constructor() {
    super();
  }

  _buildAlertsQueryFromParams(customerId: string, filters: IAlertsFilter, count: boolean = false) {
    const filterByCustomerId = customerId ? `customer_id=${customerId}` : '';
    let query = `select ${count ? 'Count(*) ': '*'} from alerts where ${filterByCustomerId} and constant_val='${constants.DB_CONSTANT_VAL}'`;
    if (filters.database) {
      query += ` AND database='${filters.database}'`;
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
    return `${query} ALLOW FILTERING`;
  }

  /**
   * this method get list of results by job entity id
   * @param jobEntityId
   * @param paging
   * @param filters
   * @param sortBy
   * @param customerId
   */
  async getAlerts(
    customerId: string,
    paging: { pageState: string | undefined, fetchSize: number } | undefined,
    filters: IAlertsFilter,
  ) {
    const options: QueryOptions = {};
    if (paging) {
      options.prepare = true;
      options.pageState = paging.pageState;
      options.fetchSize = paging.fetchSize;
    }
    const queryWithFilters = this._buildAlertsQueryFromParams(customerId, filters);
    const resp = await dbService.executeQuery(queryWithFilters, {}, options);
    return { rows: resp.rows as unknown as IAlertsResult[], pageState: resp.pageState };
  }

  async getAlertsCountWithFilters(params: any) {
    const queryWithFilters = this._buildAlertsQueryFromParams(params.customer_id,{
        database: params.database || "",
        category: params.category || "",
        subcategory: params.subCategory || "",
        updatedDate: params.updatedDate || ""
      }, true
    );
    const resp = await dbService.executeQuery(queryWithFilters);
    return parseInt(resp.rows[0].count);
  }
}

const resultsRepository = new ResultsRepository();
export default resultsRepository;
