import * as process from "process";
import { v4 as uuidv4 } from "uuid";
import commonService from "shared/services/common.service";
import bridgerService from "shared/services/bridger.service";
import batchService from "./services/batchService";
import { sampleJob } from "./__test__/mocks/entityRecord";
import dbService from "shared/services/db.service";
import jobsService from "shared/services/jobs.service";

require("module-alias/register");
require("dotenv").config();

const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

const updateJobErrorStates = async (job: any) => {
  const jobResponse = await dbService.executeQuery(`select * from job where id=${job.id} allow filtering`);
  if (!jobResponse.rows.length) {
    throw Error("Job not found");
  }
  job = jobResponse.rows[0];
  const jobId = job.id;
  const updateJobQuery = `update job set job_status='Error', job_state='processing complete' where id=${jobId} and constant_val='constantVal' and started_at='${(job.started_at as Date).toISOString()}'`;
  await dbService.executeQuery(updateJobQuery);
};

const updateJobStartedStatus = async (job: any) => {
  const jobResponse = await dbService.executeQuery(`select * from job where id=${job.id} and job_status='Pending' allow filtering`);
  if (!jobResponse.rows.length) {
    throw Error("Job not found");
  }
  job = jobResponse.rows[0];
  const jobId = job.id;
  await dbService.executeQuery(`DELETE FROM job WHERE id=${jobId} and constant_val='constantVal' and started_at='${(job.started_at as Date).toISOString()}' IF EXISTS`);
  await dbService.executeQuery(`insert into job (constant_val, started_at, id, completed_time, customer_type, customer_id, job_status, potential_matches, matched_customers, no_matches, file_path, total_input_records, job_state, job_title, monitor, updated_at) values ('constantVal', '${Date.now()}', ${jobId}, '${job.completed_time}', '${job.customer_type}', ${job.customer_id}, 'InProgress', 0, 0, 0, '${job.file_path}', 0, 'screening', '${job.job_title}', '${job.monitor}', '${Date.now()}')`);
};

let JOB_IN_PROGRESS = false;
export const processPendingJob = async () => {
  let completedJobs = 0;
  try {
    let pendingJobs = [];
    if (process.env.SCREENING_TYPE === "BATCHING") {
      const jobsUnderProcess = await dbService.executeQuery(`select id from job where job_status='InProgress' and constant_val='constantVal' allow filtering`);
      if (jobsUnderProcess.rows.length) {
        console.log('some job is already in progress.')
        return;
      }
      const pendingJobsResponse = await dbService.executeQuery(`select * from job where job_status='Pending' and constant_val='constantVal' order by started_at asc allow filtering`);
      pendingJobs = pendingJobsResponse.rows;
    } else if(process.env.SCREENING_TYPE === 'TEST') {
      pendingJobs.push(sampleJob);
    }
    else {
      pendingJobs = [{
        id: uuidv4(),
        file_path: "real-time-screening-sampleUserCopy.csv",
        job_title: "real-time-screening",
        customer_type: "Individual"
      }];
    }
    if (!pendingJobs.length) {
      throw Error("there is not pending jobs");
    }
    for (let i = 0; i < pendingJobs.length; i++) {
      const job: any = pendingJobs[i];
      JOB_IN_PROGRESS = true;
      console.log(`<====== uploads/${job.file_path} started =======>`);
      let entities: any = await commonService.readFileData(`./uploads/${job.file_path}`);

      // entities = entities.slice(0, 2);

      const entityType = job.customer_type;
      if (entities && entities.length > 0) {
        const slicedArray = commonService.splitArrayIntoChunks(entities, +process.env.CHUNK_SIZE! || 10);
        let jobId = job.id;
        if (process.env.SCREENING_TYPE === "BATCHING") {
          await updateJobStartedStatus(job);
        }

        const accessToken: string = await bridgerService.bridgerLogin();
        for (let slice of slicedArray) {
          try {
            slice = slice.map((obj: any) => ({ ...obj, id: commonService.getUuidV4(), job_id: jobId, customer_id: job.customer_id }));
            await batchService.processMultipleEntities(slice, entityType, accessToken, job.monitor);
            await timer(1000);
          } catch (e) {
            await updateJobErrorStates(job);
            JOB_IN_PROGRESS = false;
            completedJobs++;
            console.log(`<====== ${job.job_title} completed with an error =======>`);
            return;
          }
        }

        if (process.env.SCREENING_TYPE === "BATCHING") {
          await jobsService.updateJobStates(job);
        }
        JOB_IN_PROGRESS = false;
        completedJobs++;
        console.log(`<====== ${job.job_title} completed =======>`);
      }
    }
  } catch (e) {
    // todo: log errors in some file
  } finally {
    if (completedJobs > 0)
      console.log(`<====== Total ${completedJobs} jobs completed =======>`);
    else
      console.log('Waiting for jobs....')
  }
};

// startBatchScreening();

const minutes = 0.1, the_interval = minutes * 60 * 1000;
setInterval(async function() {
  if (!JOB_IN_PROGRESS) {
    await processPendingJob();
  }
}, the_interval);
