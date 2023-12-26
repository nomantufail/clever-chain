import commonService from "./common.service";
import tagsMapperService from "./tagsMapper.service";
import ruleEvaluationService from "./ruleEvaluation.service";
import { constantVal } from "../constants";
import { EntityType, FiltersType, ScreeningType } from "../enums";
import dbService from "shared/services/db.service";

const moment = require("moment");

class BatchService {
  constructor() {
  }

  categories = new Set();
  subcategories = new Set();
  databases = new Set(["WorldCompliance"]);

  matchSortScore: { [key: string]: number } = {
    "Exact": 100,
    "Very High": 90,
    "High": 80,
    "Medium": 70,
    "Low": 60,
    "Very Low": 50
  };

  processEntity = async (bridgerRecord: any, entity: any, entityType: EntityType) => {
    let mappedResults: any[] = [];

    if (bridgerRecord) {
      const entityPayload = JSON.parse(entity.bridger_payload);
      const resultsMappedForInsertion = this.searchAndScanEntity(bridgerRecord, entityPayload, entity, entityType);
      const highestMatch = this.getHighestMatchFromResults(resultsMappedForInsertion);
      const fullReports = this.prepareFullReports(resultsMappedForInsertion);
      await this.insertFullReports(fullReports, entity.id);
      await this.insertIntoJobResults(resultsMappedForInsertion);
      await this.updateStatsForJobEntity(resultsMappedForInsertion, entity.id, entity.name, highestMatch);
      mappedResults = resultsMappedForInsertion;
      const filters = this.computeEntityFilters(mappedResults);
      await this.insertFilters(entity.job_id, entity.id, filters);
      return { filters };
    }
  };

  public searchAndScanEntity(bridgerRecord: any, entityPayload: any, entity: any, entityType: EntityType) {
    const matches = bridgerRecord.Watchlist.Matches.map((match: any) => {
      return {
        ...match,
        InputDetails: entityPayload.Entity
      };
    });
    const mappedMatches = tagsMapperService.mapRecords(matches, entity, entityType);
    mappedMatches.forEach((match: any) => {
      match.category && this.categories.add(match.category);
      match.subcategory && this.subcategories.add(match.subcategory);
    });
    const rulesEvaluatedMatches = ruleEvaluationService.evaluateRules(mappedMatches, entityType);
    const resultsMappedForInsertion = this.mapEntityForInsertion(
      rulesEvaluatedMatches,
      entity,
      entityType,
      entity.job_id,
      entity.id
    );
    return resultsMappedForInsertion;
  }

  prepareFullReportAdditonalData(match: any) {
    if (!match) {
      return { findings: [], sourceLinks: [], profileNotes: "" };
    }

    let finalComments: any[] = [];
    const commentParts = (match["rawComments"] || "").split("||");
    finalComments = finalComments.concat(commentParts
      .map((str: any) => str.replace(/\s+/g, " ").trim()));

    const findings: any[] = [];
    let profileNotes: string = "";
    finalComments.forEach((comment: string) => {
      const commentParts = comment.split(":");
      let key = commentParts[0];
      let value: any = [commentParts.slice(1, commentParts.length).join(":").trim()];
      if (key.toLowerCase() === "category") {
        key = "Category | Sub-category";
        value = [value[0].replace("Subcategory:", "").replace(/\s+/g, " ").trim()];
      }
      if (key.toLowerCase() === "associations") {
        value = value[0].split("|").filter((str: any) => !!str).map((str: any) => str.trim());
      }

      if (key.toLowerCase() !== "profile notes") {
        findings.push({ key, value });
      } else {
        profileNotes = value;
      }

    });
    const sourceLinks: string[] = [];

    if (Array.isArray(match["additionalInfo"])) {
      const sourcesInfos = match["additionalInfo"].filter((info) => {
        return info["Comments"] && (info["Comments"].includes("http") || (info["Comments"].includes("https")));
      });
      sourcesInfos.forEach((source) => {
        const sourceParts = source["Comments"].split("|");
        sourceParts.forEach((sourcePart: string) => {
          const trimmedSourcePart = sourcePart.replace(/\s+/g, " ").trim();
          if (trimmedSourcePart.includes("http") || trimmedSourcePart.includes("https")) {
            sourceLinks.push(trimmedSourcePart);
          }
        });
      });
    }
    let occupationStr = '';
    if (Array.isArray(match["additionalInfo"])) {
      const occupation = match["additionalInfo"].find(info => info.Type === 'Occupation')
      if (occupation) {
        occupationStr = occupation.Value;
      }
    }
    return { findings, profileNotes, sourceLinks, occupationStr };
  }

  prepareFullReports(finalData: any) {
    const fullReports: any[] = [];
    finalData.forEach((match: any) => {
      const parsedEntityDetails = JSON.parse(match.mapped_entity_details);
      const additonalData = this.prepareFullReportAdditonalData(match);
      const otherAddresses = match.allAddresses
        .filter((add: any) => add["Street1"] !== parsedEntityDetails.addressLine1.matchedEntity)
        .map((add: any) => `${add.Street1 || ''}, ${add.City || ''}, ${add.Country || ''}`
          .split(',')
          .map(str => str.trim())
          .filter(str => !!str).join(','))
        .filter((addr: any) => !!addr);
      const fullReport = {
        name: match.name,
        matchCriteria: match.match,
        occupation: additonalData.occupationStr,
        matchDescription: [match.match_description],
        scannedDate: moment(match.created_at).format('DD/MM/YYYY'),
        generalInformation: match.entity_type === EntityType.Individual ? {
          firstName: parsedEntityDetails.firstName,
          middleName: parsedEntityDetails.middleName,
          lastName: parsedEntityDetails.lastName,
          dateOfBirth: parsedEntityDetails.dateOfBirth,
          addressLine1: parsedEntityDetails.addressLine1,
          city: parsedEntityDetails.city,
          country: parsedEntityDetails.country
        } : {
          registeredName: parsedEntityDetails.registeredName,
          tradingName: parsedEntityDetails.tradingName,
          ein: parsedEntityDetails.ein,
          addressLine1: parsedEntityDetails.addressLine1,
          city: parsedEntityDetails.city,
          country: parsedEntityDetails.country
        },
        addressAndLocation: {
          currentAddress: parsedEntityDetails.addressLine1,
          city: parsedEntityDetails.city,
          country: parsedEntityDetails.country,
          postalCode: {
            matchCriteria: "",
            matchCriteriaNumeric: 0,
            internalInfo: "",
            matchedEntity: ""
          }
        },
        otherAddresses: otherAddresses,
        findings: additonalData.findings,
        profileNotes: additonalData.profileNotes,
        sourceLinks: additonalData.sourceLinks
      }
      fullReports.push({ id: match.id, full_report: JSON.stringify(fullReport) });
    });
    return fullReports;
  }

  computeEntityFilters(mappedResults: any[]) {
    const categories = new Set();
    const subcategories = new Set();
    const databases = new Set(["WorldCompliance"]);
    mappedResults.forEach((match) => {
      match.category && categories.add(match.category);
      match.subcategory && subcategories.add(match.subcategory);
    });
    return { categories, subcategories, databases };
  }

  mapEntityForInsertion(
    rulesEvaluatedMatches: any,
    //@ts-ignore
    entity: any,
    entityType: any,
    job_id: string,
    job_entity_id: string
  ) {
    const finalResults: any[] = [];
    rulesEvaluatedMatches.forEach((match: any) => {
      finalResults.push({
        ...match,
        id: commonService.getUuidV4(),
        job_id: job_id,
        job_entity_id: job_entity_id,
        constant_val: constantVal,
        type: process.env.SCREENING_TYPE,
        entity_type: entityType,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        match_numeric: this.matchSortScore[match.match as string],
        customer_id: entity.customer_id
      });
    });
    return finalResults;
  }

  async updateStatsForJobEntity(mappedResults: any, job_entity_id: string, name: string, match: string) {
    const databaseSet = new Set();
    const categoriesSet = new Set();
    mappedResults.forEach((match: any) => {
      categoriesSet.add(match.category);
      databaseSet.add(match.database);
    });
    const categories = "[" + this.decodeSet(categoriesSet) + "]";
    const databases = "[" + this.decodeSet(databaseSet) + "]";
    const totalMatches = mappedResults.length || 0;
    const match_numeric = this.matchSortScore[match];

    const jobEntityResponse = await dbService.executeQuery(`select * from job_entity where id=${job_entity_id} allow filtering`);
    if (!jobEntityResponse.rows.length) {
      throw Error("Job not found");
    }
    const jobEntity = jobEntityResponse.rows[0];
    await dbService.executeQuery(`DELETE FROM job_entity WHERE id=${job_entity_id} and constant_val='constantVal' and match_numeric=${jobEntity.match_numeric} IF EXISTS`);
    await dbService.executeQuery(`INSERT INTO job_entity(id,job_id,name,type, match, match_numeric, total_matches, categories, customer_id, databases, constant_val, updated_at, bridger_payload, monitor) values(${job_entity_id},${jobEntity.job_id},$$${name}$$,'${ScreeningType.Batching}', '${match}', ${match_numeric}, ${totalMatches}, ${categories}, ${jobEntity.customer_id}, ${databases}, 'constantVal', '${Date.now()}', '${jobEntity.bridger_payload}', '${jobEntity.monitor}')`);
  }

  getHighestMatchFromResults(results: any[]) {
    let highestMatch = "Very Low";
    results.forEach((result) => {
      if (this.matchSortScore[highestMatch] <= this.matchSortScore[result.match]) {
        highestMatch = result.match;
      }
    });
    return highestMatch;
  }

  async insertIntoJobResults(finalData: any) {
    const queries: Array<any> = [];
    finalData.forEach((match: any) => {
      try {
        queries.push({
          query:
            "INSERT INTO job_results (id,job_id,job_entity_id,constant_val,intermediate_entity_record,intermediate_entity_details,mapped_entity_record,mapped_entity_details,entity_risk_evaluation,entity_attr_risk_evaluation,type,entity_type,name,match,match_description,match_numeric,database,category,subcategory,bridger_updated,comments,created_at,updated_at,is_deleted,customer_id, entity_unique_id) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?,?, ?, ?,?, ?, ?, ?, ?, ?, ?)",
          params: [
            match.id,
            match.job_id,
            match.job_entity_id,
            match.constant_val,
            match.intermediate_entity_record,
            match.intermediate_entity_details,
            match.mapped_entity_record,
            match.mapped_entity_details,
            match.entity_risk_evaluation,
            match.entity_attr_risk_evaluation,
            match.type,
            match.entity_type,
            match.name,
            match.match,
            match.match_description,
            match.match_numeric,
            match.database,
            match.category,
            match.subcategory,
            match.bridger_updated,
            match.comments,
            match.created_at,
            match.updated_at,
            match.is_deleted,
            match.customer_id,
            match.entity_unique_id
          ]
        });
      } catch (error) {
        console.log("error occurred", match);
      }
    });
    await dbService.executeBatch(queries);
  }

  async insertFullReports(reports: any, job_entity_id: string) {
    const queries: Array<any> = [];
    reports.forEach((report: any) => {
      try {
        queries.push({
          query:
            "INSERT INTO match_report (id, job_entity_id, constant_val,full_report,created_at,updated_at) VALUES (?, ?, ?, ?,?, ?)",
          params: [
            report.id,
            job_entity_id,
            'constantVal',
            report.full_report,
            new Date(),
            new Date(),
          ]
        });
      } catch (error) {
        console.log("error occurred", report);
      }
    });
    await dbService.executeBatch(queries);
  }

  async insertFilters(jobId: string, jobEntityId: string, filters: any) {
    const categories = "{" + this.decodeSet(filters.categories) + "}";
    const subcategories = "{" + this.decodeSet(filters.subcategories) + "}";
    const databases = "{" + this.decodeSet(filters.databases) + "}";

    const query = `INSERT INTO filters(job_id, job_entity_id, type, constant_val, categories, subcategories, databases) VALUES( ${jobId}, ${jobEntityId}, '${FiltersType.Match}', 'constantVal', ${categories}, ${subcategories}, ${databases})`;
    await dbService.executeQuery(query);
    return { categories, subcategories, databases };
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
