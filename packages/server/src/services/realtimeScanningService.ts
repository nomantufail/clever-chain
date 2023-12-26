import commonService from "shared/services/common.service";
import bridgerService from "shared/services/bridger.service";
import scanningService from "shared/services/scanning.service";
import { EntityType } from "src/enums";
import * as IndividualScreeningRequest from "interfaces/requests/individualScreeningRequest";
import * as BusinessScreeningRequest from "interfaces/requests/businessScreeningRequest";
import * as FetchMonitoringJobRequest from "interfaces/requests/FetchMonitoringJobRequest";
import moment from  'moment';
import entitiesRepository from "shared/repositories/entities.repository";
import { Monitoring } from "shared/enums";
import jobsRepository from "src/repositories/jobsRepository";
import { jobTitleMonitorIndividual, jobTitleMonitorBusiness } from "src/constants";

class RealtimeScanningService {
  constructor() {}
  categories = new Set();
  subcategories = new Set();
  databases = new Set(['WorldCompliance']);

  async scanRealtimeEntity(params: BusinessScreeningRequest.Params | IndividualScreeningRequest.Params, entityType: EntityType, customerId: string) {
    let jobId = commonService.getUuidV4();
    if (params.monitoring !== Monitoring.Never) {
      const monitoringJobParams = {
        customerId,
        jobTitle: entityType === EntityType.Individual
        ? jobTitleMonitorIndividual
        : jobTitleMonitorBusiness,
        customerType: entityType,
      };
      jobId = await jobsRepository.addMonitoringJobIfNotExists(monitoringJobParams as FetchMonitoringJobRequest.Params, jobId, params.monitoring);
    }
    const token = await bridgerService.bridgerLogin();
    let entity: any = { job_id: jobId, customer_id: customerId, id: commonService.getUuidV4() };
    if (entityType === EntityType.Business) {
      entity = { ...entity, ...this.prepareRealtimeBusinessEntityObj(params as BusinessScreeningRequest.Params)}
    } else {
      entity = { ...entity, ...this.prepareRealtimeIndividualEntityObj(params as IndividualScreeningRequest.Params)};
    }
    const entityPayload: any = entityType === EntityType.Individual
      ? bridgerService.getIndividualScreeningPayload(entity)
      : bridgerService.getBusinessScreeningPayload(entity);
    entity.bridger_payload = JSON.stringify(entityPayload);
    const entities = await entitiesRepository.insertEntities([entity], entityType, params.monitoring);
    const combinedScreeningPayload = bridgerService.combinePayloads([entityPayload]);
    const bridgerData = await bridgerService.bridgerSearch(token, combinedScreeningPayload);
    if (Array.isArray(bridgerData.Records) && bridgerData.Records.length) {
      await scanningService.processEntity(bridgerData.Records[0], entities[0], entityType);
    }
    return { jobId: entities[0].job_id, jobEntityId: entities[0].id }
  }

  prepareRealtimeBusinessEntityObj(params: BusinessScreeningRequest.Params) {
    return {
      ['Registered name']: params.name,
      ['City - Current']: params.city,
      ["Country - Current"]: params.country ? JSON.parse(params.country)['label']: '',
      ["State - Current"]: params.county,
      ["Postal Code - Current"]: params.postalCode,
      ["Address Line 1 - Current"]: params.addressLine1,
      ["Address Line 2 - Current"]: params.addressLine2,
      ['EIN']: '',
      ['SWIFT BIC']: '',
      ['Business Registration Number']: ''
    }
  }

  prepareRealtimeIndividualEntityObj(params: IndividualScreeningRequest.Params) {
    const dateOfBirth = params.dateOfBirth ? moment(params.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
    return {
      ['Title']: '',
      ['First Name']: params.firstName,
      ['Middle Name']: params.middleName,
      ['Last Name']: params.lastName,
      ["City - Current"]: params.city,
      ["Country - Current"]: params.country ? JSON.parse(params.country)['label']: '',
      ["State - Current"]: params.county,
      ["Postal Code - Current"]: params.postalCode,
      ["Address Line 1 - Current"]: params.addressLine1,
      ["Address Line 2 - Current"]: params.addressLine2,
      ["City - Previous"]: '',
      ["Country - Previous"]: '',
      ["State - Previous"]: '',
      ["Postal Code - Previous"]: '',
      ["Address Line 1 - Previous"]: '',
      ["Address Line 2 - Previous"]: '',
      ["Date of Birth"]: dateOfBirth,
      ["Nationality"]: '',
      ["Place of Birth"]: '',
      ["Occupation"]: '',
      ["Gender"]: '',
    }
  }
}

const realtimeScanningService = new RealtimeScanningService();
export default realtimeScanningService;
