import bridgerService from "shared/services/bridger.service";
import { EntityType, FiltersType } from "../enums";
import scanningService from "shared/services/scanning.service";
import dbService from "shared/services/db.service";
import entitiesRepository from "shared/repositories/entities.repository";
import { Monitoring } from "shared/enums";

class BatchService {
  constructor() {
  }

  categories = new Set();
  subcategories = new Set();
  databases = new Set(["WorldCompliance"]);

  _getEntityIdFromBridgerData(bridgerRecord: any) {
    const otherInfo =  bridgerRecord['RecordDetails']['AdditionalInfo'].find((info: any) => info.Type === 'Other');
    return otherInfo.Value;
  }

  _getScreeningPayloadByEntityId(entityId: string, screeningPayload: any) {
    return screeningPayload.SearchInput.Records.find((record: any) => {
      return record.Entity.AdditionalInfo.some((info: any) => info.Type === 'Other' && info.Value === entityId)
    });
  }

  processMultipleEntities = async (entities: any[], entityType: any, accessToken: string, monitor: Monitoring = Monitoring.Never) => {
    return new Promise(async (resolve, reject) => {
      try {
        const recordProcessors: Promise<any>[] = [];
        entities = entities.map((entity) => {
          entity.bridger_payload = entityType === EntityType.Individual
            ? JSON.stringify(bridgerService.getIndividualScreeningPayload(entity))
            : JSON.stringify(bridgerService.getBusinessScreeningPayload(entity));
          return entity;
        })
        entities = await entitiesRepository.insertEntities(entities, entityType, monitor);

        const screeningPayload: any = bridgerService.combinePayloads(entities.map((entity => JSON.parse(entity.bridger_payload))));

        const bridgerData = await bridgerService.bridgerSearch(accessToken, screeningPayload);
        bridgerData.Records.forEach((bridgerRecord: any) => {
          const entity = entities.find(entity => entity.id === this._getEntityIdFromBridgerData(bridgerRecord));
          recordProcessors.push(scanningService.processEntity(bridgerRecord, entity, entityType));
        });
        const entityProcessors = await Promise.all(recordProcessors);
        // todo: store filters for all slices. currently only one slice's filters are being stored...
        await this.insertFiltersForAllEntities(entities[0].job_id, entityProcessors);
        console.log("entities chunk processed");
        resolve("entities chunk processed");
      } catch (e: any) {
        console.log('error catch....', e)
        reject(e);
      }
    })
  };

  async insertFiltersForAllEntities(jobId: string, entityProcessors: {filters: any}[]) {
    const categories = "{" + entityProcessors.filter((record) => !!record.filters.categories.size).map((record) => this.decodeSet(record.filters.categories)).join(',') + "}";
    const subcategories = "{" + entityProcessors.filter((record) => !!record.filters.subcategories.size).map((record) => this.decodeSet(record.filters.subcategories)).join(',') + "}";
    const databases = "{" + entityProcessors.filter((record) => !!record.filters.databases.size).map((record) => this.decodeSet(record.filters.databases)).join(',') + "}";
    const query = `INSERT INTO filters(job_id, job_entity_id, type, constant_val, categories, subcategories, databases) VALUES( ${jobId}, ${jobId}, '${FiltersType.Entity}', 'constantVal', ${categories}, ${subcategories}, ${databases})`;
    await dbService.executeQuery(query);
  }

  decodeSet(setData: any) {
    let str = "";
    setData.forEach((item: any) => {
      str = str + "'" + item + "'" + ",";
    });
    return str.slice(0, -1);
  }
}

const batchService = new BatchService();
export default batchService;
