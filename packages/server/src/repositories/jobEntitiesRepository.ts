import { Repository } from "./repository";
import * as IndividualScreeningRequest from "interfaces/requests/individualScreeningRequest";
import * as FetchJobEntitiesRequest from "interfaces/requests/FetchJobEntitiesRequest";
import * as constants from "src/constants";
import { DEFAULT_PAGE_SIZE } from "src/constants";
import IJobEntityResult from "shared/server/types/response/partials/IJobEntityResult";
import { ScreeningType } from "src/enums";
import dbService from "shared/services/db.service";

export class JobEntitiesRepository extends Repository {
  constructor() {
    super();
  }

  buildJobEntitiesQuery(jobId: string, params: FetchJobEntitiesRequest.Params, count: boolean = false, screeningType: ScreeningType = ScreeningType.Batching) {
    const categories = params.category && `AND categories contains '${params.category}'` || "";
    const databases = params.database && `AND databases contains '${params.database}'` || "";
    const match = params.match && `AND match = '${params.match}'` || "";
    return `select ${count ? 'count(*) ' : '*'} from job_entity where job_id=${jobId} AND customer_id=${params?.user?.customer_id} AND type='${screeningType}' AND constant_val='${constants.DB_CONSTANT_VAL}' ${categories} ${databases} ${match} ALLOW FILTERING`;
  }

  async getJobEntitiesByJobId(jobId: string, params: FetchJobEntitiesRequest.Params, screeningType: ScreeningType = ScreeningType.Batching) {
    const paging = {
      prepare: true,
      pageState: params.page || undefined,
      fetchSize: params.recordsPerPage || DEFAULT_PAGE_SIZE
    };

    const query = this.buildJobEntitiesQuery(jobId, params, false, screeningType);
    const resp = await dbService.executeQuery(query, {}, paging);
    return { rows: resp.rows as unknown as IJobEntityResult[], pageState: resp.pageState };
  }

  async countJobEntitiesByJobId(jobId: string, params: FetchJobEntitiesRequest.Params, screeningType: ScreeningType = ScreeningType.Batching) {
    const queryWithFilters = this.buildJobEntitiesQuery(jobId, params, true, screeningType);
    const resp = await dbService.executeQuery(queryWithFilters);
    return +resp.rows[0].count;
  }

  /**
   * this method get list of results by job entity id
   * @param params
   */
  // @ts-ignore
  async getIndividualJobEntityIdBy(params: IndividualScreeningRequest.Params) {
    // todo: fetch jobEntityId based on params from db;

    const name = `${params.firstName} ${params.middleName} ${params.lastName}`.replace(/\s\s+/g, " ");
    let dob = "";
    if (params.dateOfBirth) {
      dob = `AND date_of_birth='${params.dateOfBirth}'`;
    }
    let addr1 = "";
    if (params.addressLine1) {
      addr1 = `AND address_line_1='${params.addressLine1}'`;
    }
    let addr2 = "";
    if (params.addressLine2) {
      addr2 = `AND address_line_2='${params.addressLine2}'`;
    }
    let city = "";
    if (params.city) {
      city = `AND current_city='${params.city}'`;
    }
    let country = "";
    if (params.country) {
      country = `AND country='${params.country}'`;
    }
    let county = "";
    if (params.county) {
      county = `AND county='${params.county}'`;
    }
    let postalCode = "";
    if (params.postalCode) {
      postalCode = `AND county='${params.postalCode}'`;
    }
    const resp = await dbService.executeQuery(`select id, job_id from temp_individual where name='${name}' ${city} ${country} ${county} ${postalCode} ${dob} ${addr1} ${addr2} ALLOW FILTERING`);
    const job_id = resp.rows.length ? resp.rows[0].job_id : "";
    const job_entity_id = resp.rows.length ? resp.rows[0].id : "";
    return { job_id, job_entity_id };
  }

  async getBusinessJobEntityIdBy(params: any) {
    // todo: fetch jobEntityId based on params from db;

    const name = `${params.name}`;

    let addr1 = "";
    if (params.addressLine1) {
      addr1 = `AND address_line_1='${params.addressLine1}'`;
    }
    let addr2 = "";
    if (params.addressLine2) {
      addr2 = `AND address_line_2='${params.addressLine2}'`;
    }
    let city = "";
    if (params.city) {
      city = `AND current_city='${params.city}'`;
    }
    let country = "";
    if (params.country) {
      country = `AND country='${params.country}'`;
    }
    let county = "";
    if (params.county) {
      county = `AND county='${params.county}'`;
    }
    let postalCode = "";
    if (params.postalCode) {
      postalCode = `AND county='${params.postalCode}'`;
    }
    const resp = await dbService.executeQuery(`select id, job_id from temp_individual where name='${name}' ${city} ${country} ${county} ${postalCode} ${addr1} ${addr2} ALLOW FILTERING`);
    const job_id = resp.rows.length ? resp.rows[0].job_id : "";
    const job_entity_id = resp.rows.length ? resp.rows[0].id : "";
    return { job_id, job_entity_id };
  }

  async getJobEntityById(entityId: any) {
    const resp = await dbService.executeQuery(`select * from job_entity where id=${entityId} ALLOW FILTERING`);
    return resp.rows.length && resp.rows[0] as unknown as IJobEntityResult;
  }
}

const jobEntitiesRepository = new JobEntitiesRepository();
export default jobEntitiesRepository;
