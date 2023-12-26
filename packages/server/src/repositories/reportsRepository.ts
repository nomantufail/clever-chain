import { Repository } from "./repository";
import { QueryOptions } from "cassandra-driver";
import dbService from "shared/services/db.service";

export class ReportsRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * this method get list of reports by job entity id
   * @param jobEntityId
   */
  async getMatchFullReportsByJobEntityId(
    jobEntityId: string,
  ) {
    const options: QueryOptions = {};
    const queryWithFilters = `select * from match_report where job_entity_id=${jobEntityId} allow filtering`;
    const resp = await dbService.executeQuery(queryWithFilters, {}, options);
    return resp.rows;
  }

}

const reportsRepository = new ReportsRepository();
export default reportsRepository;
