import { Repository } from "./repository";
import IFiltersData from "shared/server/types/response/partials/IFiltersData";
import IJobEntitiesFiltersData from "shared/server/types/response/partials/IJobEntitiesFiltersData";
import { FiltersType } from "src/enums";
import dbService from "shared/services/db.service";

export class FiltersRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * this method get list of filters
   */
  async getMatchFilters(jobEntityId: string): Promise<IFiltersData> {
    const resp = await dbService.executeQuery(`select databases, categories, subcategories from filters where job_entity_id=${jobEntityId} and type='${FiltersType.Match}' allow filtering`);
    return (resp.rows.length && resp.rows[0]) as unknown as IFiltersData || ({
      databases: [],
      categories: [],
      subcategories: []
    });
  }

  /**
  * this method get list of filters
*/
  async getAlertsFilters(): Promise<IFiltersData> {
    const resp = await dbService.executeQuery(`select databases, categories, subcategories from filters where type='${FiltersType.Alerts}' allow filtering`);
    return (resp.rows.length && resp.rows[0]) as unknown as IFiltersData || ({
      databases: [],
      categories: [],
      subcategories: []
    });
  }

  async getEntityFilters(jobId: string): Promise<IFiltersData> {
    const resp = await dbService.executeQuery(`select databases, categories, subcategories from filters where job_id=${jobId} AND type='${FiltersType.Entity}' allow filtering`);
    return (resp.rows.length && resp.rows[0]) as unknown as IFiltersData || ({
      databases: [],
      categories: [],
      subcategories: []
    });
  }

  // @ts-ignore
  async getJobEntitiesFilters(jobId): Promise<IJobEntitiesFiltersData> {
    return this.getEntityFilters(jobId);
  }
}

const filtersRepository = new FiltersRepository();
export default filtersRepository;
