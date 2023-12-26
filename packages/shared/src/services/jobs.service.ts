import dbService from "shared/services/db.service";
import moment from "moment";

class JobsService {
  constructor() {}

  async updateJobStates(job: any) {
    const jobResponse = await dbService.executeQuery(`select * from job where id=${job.id} allow filtering`);
    if (!jobResponse.rows.length) {
      throw Error("Job not found");
    }
    job = jobResponse.rows[0];
    const jobId = job.id;
    const totalRecordsResponse = await dbService.executeQuery(`select count(*) as total_records from job_entity where job_id=${jobId} allow filtering`);
    const totalMatchedCustomersResponse = await dbService.executeQuery(`select count(*) as total_matched_customers from job_entity where job_id=${jobId} and total_matches > 0 allow filtering`);
    const totalPotentialMatchesResponse = await dbService.executeQuery(`select count(*) as potential_matches from job_results where job_id=${jobId} allow filtering`);
    const totalRecords = +totalRecordsResponse.rows[0].total_records;
    const totalMatchedCustomers = +totalMatchedCustomersResponse.rows[0].total_matched_customers;
    const totalPotentialMatches = +totalPotentialMatchesResponse.rows[0].potential_matches;
    const noMatches = totalRecords - totalMatchedCustomers;
    const updateJobQuery = `update job set total_input_records=${totalRecords}, matched_customers=${totalMatchedCustomers}, potential_matches=${totalPotentialMatches}, no_matches=${noMatches}, completed_time='${moment().format("HH:mm:ss")}', job_status='Complete', job_state='processing complete', updated_at='${moment().format('YYYY-MM-DD')}' where id=${jobId} and started_at='${(job.started_at as Date).toISOString()}' and constant_val='constantVal'`;
    await dbService.executeQuery(updateJobQuery);
  };
}

const jobsService = new JobsService();
export default jobsService;
