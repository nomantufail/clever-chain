import * as process from "process";
import commonService from "shared/services/common.service";
import bridgerService from "shared/services/bridger.service";
import jobsService from "shared/services/jobs.service";
import monitoringService from "services/monitoring.service";
import entitiesRepository from "shared/repositories/entities.repository";

require("module-alias/register");
require("dotenv").config();

const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

export const monitorJobs = async () => {
  let jobsAvailable = true;
  while (jobsAvailable) {
    const unMonitoredJob = await monitoringService.getUnMonitoredJob();
    if (!unMonitoredJob) {
      jobsAvailable = false;
    } else {
      console.log(`<====== monitoring job: ${unMonitoredJob.job_title} =======>`);
      let entities: any = (await entitiesRepository.getAllJobEntitiesByJobId(unMonitoredJob.id));

      const entityType = unMonitoredJob.customer_type;
      if (entities && entities.length > 0) {
        const slicedArray = commonService.splitArrayIntoChunks(entities, +process.env.CHUNK_SIZE! || 10);
        let jobId = unMonitoredJob.id;

        const accessToken: string = await bridgerService.bridgerLogin();
        for (let slice of slicedArray) {
          try {
            slice = slice.map((obj: any) => ({ ...obj, job_id: jobId, customer_id: unMonitoredJob.customer_id }));
            await monitoringService.monitorMultipleEntities(slice, entityType, accessToken);
            await timer(1000);
          } catch (e) {
            console.log(`<====== error accurred:  =======>`, e);
            return;
          }
        }

        await jobsService.updateJobStates(unMonitoredJob);
        console.log(`<====== ${unMonitoredJob.job_title} completed =======>`);
      }
    }

  }
};

// console.log('Monitoring engine is running.');
// const job = new CronJob(
// 	cronJobDailyAt12AM,
// 	() => {
// 		try {
      monitorJobs().then(() => {
        console.log(`Monitoring done: ${new Date()}`);
      });
//     } catch (e) {
//       console.error(e);
//     }
// 	},
// 	null,
// 	false,
// 	'America/Los_Angeles'
// );
// job.start();
