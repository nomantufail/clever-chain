import bridgerService from "shared/services/bridger.service";
import { EntityType, Monitoring } from "shared/enums";
import scanningService from "shared/services/scanning.service";
import dbService from "shared/services/db.service";
import moment from "moment";
import changeDetectionService from "services/changeDetection.service";
import commonService from "shared/services/common.service";

class MonitoringService {
  constructor() {
  }

  async getUnMonitoredJob(): Promise<any> {
    const query = `select * from job where monitor='${Monitoring.Daily}' and updated_at < '${moment().format("YYYY-MM-DD")}' allow filtering`;
    const result = await dbService.executeQuery(query);
    return result.rows[0];
  }

  _getEntityIdFromBridgerData(bridgerRecord: any) {
    const otherInfo = bridgerRecord["RecordDetails"]["AdditionalInfo"].find((info: any) => info.Type === "Other");
    return otherInfo.Value;
  }

  getScreeningPayload(entities: any[]) {
    return {
      SearchConfiguration: {
        AssignResultTo: {
          Division: "Default division",
          RolesOrUsers: ["Administrator"],
          Type: "Role"
        },
        PredefinedSearchName: "CS_Full"
      },
      SearchInput: { BlockID: "string", Records: [...entities.map(entity => entity.bridger_payload)] }
    };
  }

  async monitorMultipleEntities(entities: any[], entityType: any, accessToken: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const recordProcessors: Promise<any>[] = [];
        const screeningPayload: any = bridgerService.combinePayloads(entities.map(entity => JSON.parse(entity.bridger_payload)));
        const bridgerData = await bridgerService.bridgerSearch(accessToken, screeningPayload);
        bridgerData.Records.forEach((bridgerRecord: any) => {
          const entity = entities.find(entity => entity.id.toString() === this._getEntityIdFromBridgerData(bridgerRecord));
          recordProcessors.push(this.monitorEntity(bridgerRecord, entity, JSON.parse(entity.bridger_payload), entityType));
        });
        await Promise.all(recordProcessors);
        console.log("entities chunk processed");
        resolve("entities chunk processed");
      } catch (e: any) {
        console.log("error catch....", e);
        reject(e);
      }
    });
  };

  monitorEntity = async (bridgerRecord: any, entity: any, entityPayload: any, entityType: EntityType) => {
    if (bridgerRecord) {
      const oldMatches = await this.getMatchesByEntityId(entity.id);
      const resultsMappedForInsertion = scanningService.searchAndScanEntity(bridgerRecord, entityPayload, entity, entityType);
      const fullReports = scanningService.prepareFullReports(resultsMappedForInsertion);
      await this.updateMatchReports(fullReports, entity.id);
      await this.updateJobResults(resultsMappedForInsertion, entity.id);
      const highestMatch = scanningService.getHighestMatchFromResults(resultsMappedForInsertion);
      await scanningService.updateStatsForJobEntity(resultsMappedForInsertion, entity.id, entity.name, highestMatch);

      const newMatch: any = { ...resultsMappedForInsertion[0], id: commonService.getUuidV4(), entityUniqueId: commonService.getUuidV4().toString() }
      resultsMappedForInsertion.push(newMatch);

      console.log(JSON.stringify(oldMatches[0], null ,2), JSON.stringify(newMatch[0], null ,2))
      const alerts = changeDetectionService.getAlerts(oldMatches, [newMatch]).map((alert) => {
        alert.comments = '';
        alert.intermediate_entity_record_parsed = {};
        alert.rawComments = '';
        alert.mapped_entity_details = '';
        return alert;
      });
      console.log(alerts)
      await this.writeAlertsToDb(alerts);
    }
  };

  async getMatchesByEntityId(entityId: string) {
    const result = await dbService.executeQuery(`select * from job_results where job_entity_id=${entityId} ALLOW FILTERING`);
    return result.rows;
  }

  async writeAlertsToDb(alerts: any) {
    const queries: Array<any> = [];
    alerts.forEach((alert: any) => {
      try {
        queries.push({
          query:
              "INSERT INTO alerts (id,match_id,alert_type,constant_val,customer_id,match,match_description,match_numeric,type,entity_type,name,bridger_updated,database,old_match,category,subcategory,old_categories,new_categories,comments,mapped_entity_details,created_at,updated_at,is_deleted) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?,?, ?, ?,?,?,?,?)",
          params: [
            commonService.getUuidV4(),
            alert.id,
            alert.alert_type,
            alert.constant_val,
            alert.customer_id,
            alert.match,
            alert.match_description,
            alert.match_numeric,
            alert.type,
            alert.entity_type,
            alert.name,
            alert.bridger_updated,
            alert.database,
            alert.old_match,
            alert.category,
            alert.subcategory,
            alert.old_categories,
            alert.new_categories,
            alert.comments,
            alert.mapped_entity_details,
            alert.created_at,
            alert.updated_at,
            alert.is_deleted
          ]
        });
      } catch (error) {
        console.log("error occurred", alert);
      }
    });
    await dbService.executeBatch(queries);
  }


  updateJobResults = async (newResults: any[], job_entity_id: string) => {
    const oldResults = (await dbService.executeQuery(`select id, match_numeric from job_results where job_entity_id=${job_entity_id} allow filtering`)).rows;
    const queries: Array<any> = [];
    oldResults.forEach((oldResult: any) => {
      queries.push({
        query:
          "delete from job_results where id=? and constant_val='constantVal' and match_numeric=? if exists",
        params: [
          oldResult.id,
          oldResult.match_numeric
        ]
      });
    });
    await dbService.executeBatch(queries);
    await scanningService.insertIntoJobResults(newResults);
  };

  updateMatchReports = async (fullReports: any[], job_entity_id: string) => {
    const oldResults = (await dbService.executeQuery(`select id, job_entity_id from match_report where job_entity_id=${job_entity_id} allow filtering`)).rows;
    const queries: Array<any> = [];
    oldResults.forEach((oldResult: any) => {
      queries.push({
        query:
          "delete from match_report where id=? and constant_val='constantVal' and job_entity_id=? if exists",
        params: [
          oldResult.id,
          job_entity_id
        ]
      });
    });
    await dbService.executeBatch(queries);
    await scanningService.insertFullReports(fullReports, job_entity_id);
  };
}

const monitoringService = new MonitoringService();
export default monitoringService;

