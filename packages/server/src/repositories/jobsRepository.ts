import { Repository } from "./repository";
import * as FetchJobsRequest from "interfaces/requests/FetchJobsRequest";
import * as FetchMonitoringJobRequest from "interfaces/requests/FetchMonitoringJobRequest";
import * as constants from "src/constants";
import { DEFAULT_PAGE_SIZE } from "src/constants";
import IJobResult from "shared/server/types/response/partials/IJobResult";
import * as FetchJobEntitiesRequest from "interfaces/requests/FetchJobEntitiesRequest";
// @ts-ignore
import { EntityType, JobState, JobStatus } from "src/enums";
import commonService from "shared/services/common.service";
import dbService from "shared/services/db.service";
import { Monitoring } from "shared/enums";

export class JobsRepository extends Repository {
  constructor() {
    super();
  }

  buildJobsQuery(params: FetchJobsRequest.Params, count: boolean = false) {
    const startedDate = params.startedDate && `AND started_at >= '${params.startedDate}'` || '';
    const customerType = params.customerType && `AND customer_type = '${params.customerType}'` || '';
    return `select ${count ? 'count(*) ' : '*'} from job where customer_id=${params?.user?.customer_id} and constant_val='${constants.DB_CONSTANT_VAL}' ${startedDate} ${customerType} ALLOW FILTERING`;
  }

  buildMonitoringJobQuery(params: FetchMonitoringJobRequest.Params) {
    const customerType = params.customerType && `AND customer_type = '${params.customerType}'` || '';
    const jobTitle = params.jobTitle && `AND job_title = '${params.jobTitle}'` || '';
    return `select * from job where customer_id=${params?.customerId} and constant_val='${constants.DB_CONSTANT_VAL}' ${customerType} ${jobTitle} ALLOW FILTERING`;
  }

  async getJobs(params: FetchJobsRequest.Params) {
    const paging = {
      prepare: true,
      pageState: params.page || undefined,
      fetchSize: params.recordsPerPage || DEFAULT_PAGE_SIZE
    };

    const resp = await dbService.executeQuery(this.buildJobsQuery(params), {}, paging);
    return { rows: resp.rows as unknown as IJobResult[], pageState: resp.pageState }
  }

  async addMonitoringJobIfNotExists(params: FetchMonitoringJobRequest.Params, jobId: string, monitoring: Monitoring = Monitoring.Daily) {
    const resp = await dbService.executeQuery(this.buildMonitoringJobQuery(params), {});
    if (resp.rows[0]) {
      return resp.rows[0]['id'];
    }
    const customerType = params.customerType === EntityType.Business ? EntityType.Business : EntityType.Individual;
    const jobTitle = params.jobTitle || '';
    const customerId = params.customerId || '';
    await jobsRepository.createJob(constants.monitoredJob, jobTitle, customerType, customerId, monitoring, jobId);
    return jobId;
  }

  async countJobs(params: FetchJobEntitiesRequest.Params) {
    const queryWithFilters = this.buildJobsQuery(params, true);
    const resp = await dbService.executeQuery(queryWithFilters);
    return +resp.rows[0].count;
  }

  async getJobById(jobId: string) {
    const resp = await dbService.executeQuery(`select * from job where id=${jobId} ALLOW FILTERING`);
    return resp.rows.length && resp.rows[0] as unknown as IJobResult
  }

  async createJob(filePath: string, fileTitle: string, entityType: EntityType, customerId: string, monitoring: Monitoring = Monitoring.Never, jobId: string = commonService.getUuidV4()) {
    const startedAt = Date.now();
    const jobStatus = monitoring === Monitoring.Never ? JobStatus.Pending : JobStatus.Complete;
    const jobState = monitoring === Monitoring.Never ? JobState.FileUploaded : JobState.ProcessingComplete;
    const query = `insert into job (constant_val, started_at, id, completed_time, customer_type, customer_id, job_status, potential_matches, matched_customers, no_matches, file_path, total_input_records, job_state, job_title, monitor, updated_at) values ('constantVal', '${startedAt}', ${jobId}, '01:01:00', '${entityType}', ${customerId}, '${jobStatus}', 0, 0, 0, '${filePath}', 0, '${jobState}', '${fileTitle}', '${monitoring}', ${Date.now()});`;
    await dbService.executeQuery(query);
    return jobId;
  }
}

const jobsRepository = new JobsRepository();
export default jobsRepository;
