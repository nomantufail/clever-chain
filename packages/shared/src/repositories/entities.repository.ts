import { EntityType, Monitoring, ScreeningType } from "../enums";
import dbService from "shared/services/db.service";

export class EntitiesRepository {
  async saveIndividualEntity(entity: any, monitor: Monitoring) {
    const job_id = entity.job_id;
    const name = entity["First Name"] + " " + entity["Middle Name"] + " " + entity["Last Name"];
    let dob = entity["Date of Birth"] || "0001-01-01";
    if (dob && dob.length > 0) {
      dob = dob
        .split("/")
        .map((part: string) => part.length < 2 ? "0" + part : part)
        .reverse()
        .join("-");
    }
    let query = `INSERT INTO job_entity(id,job_id,name,type, entity_type, total_matches, match, match_numeric, constant_val, customer_id, monitor, bridger_payload) values(${entity.id},${job_id},$$${name}$$,'${ScreeningType.Batching}', '${EntityType.Individual}', 0, '', 0, 'constantVal', ${entity.customer_id}, '${monitor}', '${entity.bridger_payload}')`;
    await dbService.executeQuery(query);
  }

  async getAllJobEntitiesByJobId(jobId: string) {
    const result = await dbService.executeQuery(`select * from job_entity where job_id=${jobId} ALLOW FILTERING`);
    return result.rows;
  }

  async saveBusinessEntity(entity: any, monitor: Monitoring) {
    const job_id = entity.job_id;
    const name = entity["Registered name"];
    let query = `INSERT INTO job_entity(id,job_id,name,type, entity_type, total_matches, match, match_numeric, constant_val, customer_id, monitor, bridger_payload) values(${entity.id},${job_id},$$${name}$$,'${ScreeningType.Batching}', '${EntityType.Business}', 0, '', 0, 'constantVal', ${entity.customer_id}, '${monitor}', '${entity.bridger_payload}')`;
    await dbService.executeQuery(query);
  }

  /**
   * this method will insert given users data into database table
   */
  async insertEntities(entities: any, entityType: EntityType, monitoring: Monitoring = Monitoring.Never): Promise<any> {
    try {
      const pushedEntities = [];
      for (const entity of entities) {
        let name = '';
        let job_id = entity.job_id;
        if (entityType === EntityType.Individual) {
          name = `${entity["First Name"]} ${entity["Middle Name"]} ${entity["Last Name"]}`.replace(/\s\s+/g, " ");
          await this.saveIndividualEntity(entity, monitoring);
        } else {
          name = entity["Registered name"];
          await this.saveBusinessEntity(entity, monitoring);
        }
        pushedEntities.push({...entity, job_id, name })
      }
      return pushedEntities
    } catch (err) {
      console.log("error occured", err);
    }
  }

}

const entitiesRepository = new EntitiesRepository();
export default entitiesRepository;
