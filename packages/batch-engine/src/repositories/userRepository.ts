import { Repository } from "./repository";
import { v4 as uuidv4 } from "uuid";
import commonService from "shared/services/common.service";
import { EntityType, ScreeningType } from "shared/enums";
import dbService from "shared/services/db.service";

export class UserRepository extends Repository {
  constructor() {
    super();
  }

  async saveIndividualEntity(entity: any, id: string) {
    const job_id = entity.job_id;
    const name = entity["First Name"] + " " + entity["Middle Name"] + " " + entity["Last Name"];
    const time = await commonService.now();
    let dob = entity["Date of Birth"] || "0001-01-01";
    if (dob && dob.length > 0) {
      dob = dob
        .split("/")
        .map((part: string) => part.length < 2 ? "0" + part : part)
        .reverse()
        .join("-");
    }
    const address1 = entity["Address Line 1 - Current"];
    const address2 = entity["Address Line 2 - Current"];
    const currentCity = entity["City - Current"];
    const currentCountry = entity["Country - Current"];
    const currentPostal = entity["Postal Code - Current"];
    let query;
    if (process.env.SCREENING_TYPE === ScreeningType.RealTime) {
      query = `INSERT INTO temp_individual(id,job_id,name,date_of_birth,address_line_1,address_line_2,current_country,current_city,current_postal_code,constant_val,created_at,updated_at) values(${id},${entity.job_id},$$${name}$$,$$${dob}$$,$$${address1}$$,$$${address2}$$,$$${currentCountry}$$,$$${currentCity}$$,$$${currentPostal}$$,'constantVal', '${time}', '${time}')`;
    } else {
      query = `INSERT INTO job_entity(id,job_id,name,type, entity_type, total_matches, match, match_numeric, constant_val, customer_id, monitor) values(${id},${job_id},$$${name}$$,'${ScreeningType.Batching}', '${EntityType.Individual}', 0, '', 0, 'constantVal', ${entity.customer_id})`;
    }
    await dbService.executeQuery(query);
  }

  async saveBusinessEntity(entity: any, id: string) {
    const job_id = entity.job_id;
    const name = entity["Registered name"];
    const time = await commonService.now();
    const address1 = entity["Address Line 1 - Current"];
    const address2 = entity["Address Line 2 - Current"];
    const currentCity = entity["City - Current"];
    const currentCountry = entity["Country - Current"];
    const currentPostal = entity["Postal Code - Current"];
    let query;
    if (process.env.SCREENING_TYPE === ScreeningType.RealTime) {
      query = `INSERT INTO temp_individual(id,job_id,name,address_line_1,address_line_2,current_country,current_city,current_postal_code,constant_val,created_at,updated_at) values(${id},${entity.job_id},$$${name}$$,$$${address1}$$,$$${address2}$$,$$${currentCountry}$$,$$${currentCity}$$,$$${currentPostal}$$,'constantVal', '${time}', '${time}')`;
    } else {
      query = `INSERT INTO job_entity(id,job_id,name,type, entity_type, total_matches, match, match_numeric, constant_val, customer_id) values(${id},${job_id},$$${name}$$,'${ScreeningType.Batching}', '${EntityType.Business}', 0, '', 0, 'constantVal', ${entity.customer_id})`;
    }
    await dbService.executeQuery(query);
  }
  /**
   * this method will insert given users data into database table
   */
  async insertEntities(entities: any, entityType: EntityType): Promise<any> {
    try {
      const pushedEntities = [];
      for (const entity of entities) {
        const id = uuidv4();
        let name = '';
        let job_id = entity.job_id;
        if (entityType === EntityType.Individual) {
          // name = entity["First Name"] + " " + entity["Middle Name"] + " " + entity["Last Name"];
          name = `${entity["First Name"]} ${entity["Middle Name"]} ${entity["Last Name"]}`.replace(/\s\s+/g, " ");
          await this.saveIndividualEntity(entity, id);
        } else {
          name = entity["Registered name"];
          await this.saveBusinessEntity(entity, id);
        }
        pushedEntities.push({...entity, job_id, id, name })
      }
      return pushedEntities
    } catch (err) {
      console.log("error occured", err);
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
