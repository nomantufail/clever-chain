// @ts-nocheck
import { NextFunction, Request, Response } from "express";
import SuccessResponse from "src/responses/successResponse";
import * as FetchJobsRequest from "interfaces/requests/FetchJobsRequest";
import * as FetchJobEntitiesRequest from "interfaces/requests/FetchJobEntitiesRequest";
import * as FetchJobMatchesRequest from "interfaces/requests/FetchJobMatchesRequest";
import { DEFAULT_PAGE_SIZE } from "src/constants";
import jobsRepository from "src/repositories/jobsRepository";
import jobEntitiesRepository from "src/repositories/jobEntitiesRepository";
import filtersRepository from "src/repositories/filtersRepository";
import { HttpStatusCode } from "src/enums";
import { ErrorResponse } from "src/responses";
import resultsRepository from "src/repositories/resultsRepository";
import realTimeScreeningService from "services/realTimeScreeningService";

class JobsController {
  async fetchJobs(request: Request, response: Response, next: NextFunction) {
    try {
      // const params = {...request.query as unknown as FetchJobsRequest.Params, ...{user: response.locals.user}};
      // const results = await jobsRepository.getJobs(params);
      // const totalRecordsWithFilters = 10//await jobsRepository.countJobs(params);
      response.send(new SuccessResponse<any>({
        "results": [
          {
            "constant_val": "constantVal",
            "started_at": "2023-12-25T19:31:25.323Z",
            "id": "a8a047fe-1586-4422-a203-1a65f5b0c5ad",
            "completed_time": "01:01:00",
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "customer_type": "Individual",
            "deleted_at": null,
            "deleted_by": null,
            "error_message": null,
            "file_path": "1703532685305_Screening Sample Individual(new-updatedversion) v1.2 (5).csv",
            "is_deleted": null,
            "job_state": "file uploaded",
            "job_status": "Pending",
            "job_title": "Screening Sample Individual(new-updatedversion) v1.2 (5).csv",
            "matched_customers": 0,
            "monitor": "Never",
            "no_matches": 0,
            "potential_matches": 0,
            "total_input_records": 0,
            "updated_at": "2023-12-25T19:31:25.323Z",
            "updated_by": null
          },
          {
            "constant_val": "constantVal",
            "started_at": "2022-08-01T06:41:58.646Z",
            "id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "completed_time": "11:49:26",
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "customer_type": "Individual",
            "deleted_at": null,
            "deleted_by": null,
            "error_message": null,
            "file_path": "1659336114862_Screening Sample Individual(new-updatedversion) v1.2 (4).csv",
            "is_deleted": null,
            "job_state": "processing complete",
            "job_status": "Complete",
            "job_title": "Screening Sample Individual(new-updatedversion) v1.2 (4).csv",
            "matched_customers": 4,
            "monitor": "Daily",
            "no_matches": 2,
            "potential_matches": 48,
            "total_input_records": 6,
            "updated_at": "2022-08-01T00:00:00.000Z",
            "updated_by": null
          }
        ],
        "paging": {
          "nextPage": false,
          "totalPages": 1,
          "totalRecordsAvailable": 10
        }
      }));
    } catch (e) {
      next(e);
    }
  }

  // @ts-ignore
  async fetchJobEntities(request: Request, response: Response, next: NextFunction) {
    try {
      // const params = {...request.query as unknown as FetchJobEntitiesRequest.Params, ...{user: response.locals.user}};
      // const results = await jobEntitiesRepository.getJobEntitiesByJobId(request.params.id, params);
      // const totalRecordsWithFilters = await jobEntitiesRepository.countJobEntitiesByJobId(request.params.id, params);
      // const filtersData = await filtersRepository.getJobEntitiesFilters(request.params.id)
      // const job = await jobsRepository.getJobById(request.params.id)
      // response.send(new SuccessResponse<any>({
      //   results: results.rows,
      //   paging: {
      //     nextPage: results.pageState,
      //     totalPages: Math.ceil(totalRecordsWithFilters / (params.recordsPerPage || DEFAULT_PAGE_SIZE)),
      //     totalRecordsAvailable:totalRecordsWithFilters,
      //   },
      //   filtersData,
      //   jobTitle: job && job.job_title
      // }));

      response.send(new SuccessResponse<any>({
        "results": [
          {
            "constant_val": "constantVal",
            "match_numeric": 100,
            "id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "bridger_payload": "{\"Entity\":{\"EntityType\":\"Individual\",\"Name\":{\"Title\":\"Mr\",\"First\":\"Silvio\",\"Middle\":\"\",\"Last\":\"Rose\"},\"Addresses\":[{\"City\":\"Roma\",\"Country\":\"Italia\",\"StateProvinceDistrict\":\"Lazio\",\"PostalCode\":\"186\",\"Street1\":\"Piazza Colonna\",\"Street2\":\"\",\"Type\":\"Current\"},{\"City\":\"\",\"Country\":\"\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Previous\"}],\"AdditionalInfo\":[{\"Type\":\"DOB\",\"Value\":\"\"},{\"Type\":\"Nationality\",\"Value\":\"Italian\"},{\"Type\":\"PlaceOfBirth\",\"Value\":\"Milan\"},{\"Type\":\"Occupation\",\"Value\":\"former prime minister\"},{\"Type\":\"Other\",\"Value\":\"6e84f873-63f3-40f8-922a-f386de97337c\"}],\"IDs\":[{\"Type\":\"Other\",\"Number\":\"BRLSLV36P29F205W\"}]}}",
            "categories": [
              "Adverse Media",
              "PEP",
              "Enforcement"
            ],
            "category": null,
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "data_record": null,
            "databases": [
              "WorldCompliance"
            ],
            "deleted_at": null,
            "deleted_by": null,
            "entity_type": null,
            "is_deleted": null,
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_status": null,
            "match": "Exact",
            "monitor": "Never",
            "name": "Sillllvio Rose",
            "submitted_timestamp": null,
            "total_matches": 11,
            "type": "BATCHING",
            "updated_at": "2022-08-01T06:49:25.854Z",
            "updated_by": null
          },
          {
            "constant_val": "constantVal",
            "match_numeric": 100,
            "id": "01fcc9d6-b924-4ddb-ac44-920ad979f364",
            "bridger_payload": "{\"Entity\":{\"EntityType\":\"Individual\",\"Name\":{\"Title\":\"Mr\",\"First\":\"Silvio\",\"Middle\":\"\",\"Last\":\"Berlusconi\"},\"Addresses\":[{\"City\":\"\",\"Country\":\"Italy\",\"StateProvinceDistrict\":\"Lazio\",\"PostalCode\":\"186\",\"Street1\":\"Via del Plebiscito, 102 Roma\",\"Street2\":\"\",\"Type\":\"Current\"},{\"City\":\"Roma\",\"Country\":\"\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"Piazza Colonna\",\"Street2\":\"\",\"Type\":\"Previous\"}],\"AdditionalInfo\":[{\"Type\":\"DOB\",\"Value\":\"29/09/1936\"},{\"Type\":\"Nationality\",\"Value\":\"Italian\"},{\"Type\":\"PlaceOfBirth\",\"Value\":\"Milan\"},{\"Type\":\"Occupation\",\"Value\":\"former prime minister\"},{\"Type\":\"Other\",\"Value\":\"01fcc9d6-b924-4ddb-ac44-920ad979f364\"}],\"IDs\":[{\"Type\":\"Other\",\"Number\":\"BRLSLV36P29F205W\"}],\"Gender\":\"male\"}}",
            "categories": [
              "Adverse Media",
              "PEP"
            ],
            "category": null,
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "data_record": null,
            "databases": [
              "WorldCompliance"
            ],
            "deleted_at": null,
            "deleted_by": null,
            "entity_type": null,
            "is_deleted": null,
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_status": null,
            "match": "Exact",
            "monitor": "Never",
            "name": "Silvio Berlusconi",
            "submitted_timestamp": null,
            "total_matches": 2,
            "type": "BATCHING",
            "updated_at": "2022-08-01T06:49:25.826Z",
            "updated_by": null
          },
          {
            "constant_val": "constantVal",
            "match_numeric": 60,
            "id": "5e55fdd2-eddf-4eda-b7dc-9150d4c9c0c9",
            "bridger_payload": "{\"Entity\":{\"EntityType\":\"Individual\",\"Name\":{\"Title\":\"Mr\",\"First\":\"Jack\",\"Middle\":\"Mario\",\"Last\":\"Bros\"},\"Addresses\":[{\"City\":\"\",\"Country\":\"Mexico\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Current\"},{\"City\":\"\",\"Country\":\"\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Previous\"}],\"AdditionalInfo\":[{\"Type\":\"DOB\",\"Value\":\"12/1/1982\"},{\"Type\":\"Nationality\",\"Value\":\"\"},{\"Type\":\"PlaceOfBirth\",\"Value\":\"Saltillo, Coahuila, Mexico\"},{\"Type\":\"Occupation\",\"Value\":\"\"},{\"Type\":\"Other\",\"Value\":\"5e55fdd2-eddf-4eda-b7dc-9150d4c9c0c9\"}],\"IDs\":[{\"Type\":\"Other\",\"Number\":\"\"}]}}",
            "categories": [
              "Adverse Media",
              "Enforcement"
            ],
            "category": null,
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "data_record": null,
            "databases": [
              "WorldCompliance"
            ],
            "deleted_at": null,
            "deleted_by": null,
            "entity_type": null,
            "is_deleted": null,
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_status": null,
            "match": "Low",
            "monitor": "Never",
            "name": "Jack Mario Bros",
            "submitted_timestamp": null,
            "total_matches": 3,
            "type": "BATCHING",
            "updated_at": "2022-08-01T06:49:25.802Z",
            "updated_by": null
          },
          {
            "constant_val": "constantVal",
            "match_numeric": 50,
            "id": "fe240a2b-1e25-48a1-88fe-b1eac50b16cd",
            "bridger_payload": "{\"Entity\":{\"EntityType\":\"Individual\",\"Name\":{\"Title\":\"Mr\",\"First\":\"Sara\",\"Middle\":\"\",\"Last\":\"Martin\"},\"Addresses\":[{\"City\":\"Arcore\",\"Country\":\"Italy\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Current\"},{\"City\":\"\",\"Country\":\"\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Previous\"}],\"AdditionalInfo\":[{\"Type\":\"DOB\",\"Value\":\"9/8/1936\"},{\"Type\":\"Nationality\",\"Value\":\"\"},{\"Type\":\"PlaceOfBirth\",\"Value\":\"\"},{\"Type\":\"Occupation\",\"Value\":\"\"},{\"Type\":\"Other\",\"Value\":\"fe240a2b-1e25-48a1-88fe-b1eac50b16cd\"}],\"IDs\":[{\"Type\":\"Other\",\"Number\":\"\"}],\"Gender\":\"Female\"}}",
            "categories": [
              "PEP",
              "Enforcement",
              "Adverse Media"
            ],
            "category": null,
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "data_record": null,
            "databases": [
              "WorldCompliance"
            ],
            "deleted_at": null,
            "deleted_by": null,
            "entity_type": null,
            "is_deleted": null,
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_status": null,
            "match": "Very Low",
            "monitor": "Never",
            "name": "Sara Martin",
            "submitted_timestamp": null,
            "total_matches": 32,
            "type": "BATCHING",
            "updated_at": "2022-08-01T06:49:25.796Z",
            "updated_by": null
          },
          {
            "constant_val": "constantVal",
            "match_numeric": 0,
            "id": "bd20ffe2-41c6-4ac9-8b45-bd76a0ab51e1",
            "bridger_payload": "{\"Entity\":{\"EntityType\":\"Individual\",\"Name\":{\"Title\":\"Mr\",\"First\":\"Jack\",\"Middle\":\"\",\"Last\":\"Bros\"},\"Addresses\":[{\"City\":\"Arcore\",\"Country\":\"Italy\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Current\"},{\"City\":\"\",\"Country\":\"\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Previous\"}],\"AdditionalInfo\":[{\"Type\":\"DOB\",\"Value\":\"9/8/1936\"},{\"Type\":\"Nationality\",\"Value\":\"\"},{\"Type\":\"PlaceOfBirth\",\"Value\":\"\"},{\"Type\":\"Occupation\",\"Value\":\"\"},{\"Type\":\"Other\",\"Value\":\"bd20ffe2-41c6-4ac9-8b45-bd76a0ab51e1\"}],\"IDs\":[{\"Type\":\"Other\",\"Number\":\"\"}],\"Gender\":\"male\"}}",
            "categories": null,
            "category": null,
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "data_record": null,
            "databases": null,
            "deleted_at": null,
            "deleted_by": null,
            "entity_type": "Individual",
            "is_deleted": null,
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_status": null,
            "match": "",
            "monitor": "Never",
            "name": "Jack  Bros",
            "submitted_timestamp": null,
            "total_matches": 0,
            "type": "BATCHING",
            "updated_at": null,
            "updated_by": null
          },
          {
            "constant_val": "constantVal",
            "match_numeric": 0,
            "id": "55a3956c-3653-46a4-bb7b-23769c165a31",
            "bridger_payload": "{\"Entity\":{\"EntityType\":\"Individual\",\"Name\":{\"Title\":\"Mr\",\"First\":\"Jack\",\"Middle\":\"\",\"Last\":\"Bros\"},\"Addresses\":[{\"City\":\"London\",\"Country\":\"UK\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"W1 54P\",\"Street1\":\"1 High Street\",\"Street2\":\"\",\"Type\":\"Current\"},{\"City\":\"1 High Street\",\"Country\":\"UK\",\"StateProvinceDistrict\":\"\",\"PostalCode\":\"\",\"Street1\":\"\",\"Street2\":\"\",\"Type\":\"Previous\"}],\"AdditionalInfo\":[{\"Type\":\"DOB\",\"Value\":\"10/1/1981\"},{\"Type\":\"Nationality\",\"Value\":\"Italian\"},{\"Type\":\"PlaceOfBirth\",\"Value\":\"\"},{\"Type\":\"Occupation\",\"Value\":\"\"},{\"Type\":\"Other\",\"Value\":\"55a3956c-3653-46a4-bb7b-23769c165a31\"}],\"IDs\":[{\"Type\":\"Other\",\"Number\":\"\"}],\"Gender\":\"Male\"}}",
            "categories": null,
            "category": null,
            "created_at": null,
            "created_by": null,
            "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
            "data_record": null,
            "databases": null,
            "deleted_at": null,
            "deleted_by": null,
            "entity_type": "Individual",
            "is_deleted": null,
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_status": null,
            "match": "",
            "monitor": "Never",
            "name": "Jack  Bros",
            "submitted_timestamp": null,
            "total_matches": 0,
            "type": "BATCHING",
            "updated_at": null,
            "updated_by": null
          }
        ],
        "paging": {
          "nextPage": null,
          "totalPages": 1,
          "totalRecordsAvailable": 6
        },
        "filtersData": {
          "databases": [
            "WorldCompliance"
          ],
          "categories": [
            "Adverse Media",
            "Enforcement",
            "PEP"
          ],
          "subcategories": [
            "Antitrust Violations",
            "Bank Fraud",
            "Bribery",
            "Conspiracy",
            "Debarred",
            "Disciplined",
            "Disqualified",
            "Drug Trafficking",
            "Excluded Party",
            "Extort-Rack-Threats",
            "Family Member",
            "Financial Crimes",
            "Fraud",
            "Govt Branch Member",
            "Mgmt Govt Corp",
            "Securities Fraud",
            "Unauthorized"
          ]
        },
        "jobTitle": "Screening Sample  Individual(new-updatedversion) v1.2 (4).csv"
      }))
    } catch (e) {
      next(e);
    }
  }

  // @ts-ignore
  async fetchJobMatches(request: Request, response: Response, next: NextFunction) {
    try {
      // const params = {...request.query as unknown as FetchJobMatchesRequest.Params, ...{user: response.locals.user}};
      // if (!request.params.jobId || !request.params.entityId) {
      //   response.status(HttpStatusCode.BadRequest)
      //     .send(new ErrorResponse('Invalid jobId or job entity id', HttpStatusCode.BadRequest))
      //   return;
      // }
      // const entity = await jobEntitiesRepository.getJobEntityById(request.params.entityId!);
      // if (!entity) {
      //   response.status(HttpStatusCode.BadRequest)
      //     .send(new ErrorResponse('Entity does not exist in dummy data.', HttpStatusCode.BadRequest))
      //   return;
      // }
      // const {job_id, id: job_entity_id} = entity;
      // const counts = await resultsRepository.getMatchCountsByEntityId(job_entity_id)
      // const totalRecordsWithFilters = await resultsRepository.getResultsCountWithFilters(job_entity_id, params)
      // const results = await realTimeScreeningService.getMatchesByEntityId(job_entity_id, params);
      // const filtersData = await filtersRepository.getMatchFilters(job_entity_id)
      // const job = await jobsRepository.getJobById(job_id)
      response.send(new SuccessResponse<any>({
        "counts": {
          "exact": 1,
          "veryHigh": 0,
          "high": 0,
          "medium": 0,
          "low": 0,
          "veryLow": 10,
          "all": 11
        },
        "results": [
          {
            "id": "b26c4405-4bf9-42ea-a5f7-c4d0b251b4cf",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Adverse Media",
            "subcategory": "Bribery",
            "match": "Exact",
            "match_description": "Name + Exact Date Of Birth  + Exact address",
            "name": "Berlusconi, Silvio",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Silvio\"},\"middleName\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"lastName\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Berlusconi\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1936-09-29\"},\"addressLine1\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Wiertzstraat 60,Allée du Printemps,Lungotevere Ripa, No. 1,Piazza Colonna, No. 370,Piazza Madama,Piazza Montecitorio,Piazzale della Farnesina, No. 1,San Lorenzo in Lucina,Via del Plebiscito, 102,Via in Lucina, 17,Via Molise, No. 2,Via XX Settembre, No. 97\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Brussels,Strasbourg,Rome\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Belgium,France,Italy\"},\"id\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"BRLSLV36P29F205W(Other) | 9080(ProprietaryUID)\"}}",
            "bridger_updated": "2020-01-10T00:00:00.000Z",
            "comments": "[\"Date listed: 2002-05-01\",\"Occupation: Former Prime Minister of Italy (May 07, 2008 - November 16, 2011). On trial for corruption - March, 2018.\",\"Source: International,Website\",\"Level: International\",\"Category: Adverse Media | Subcategory: Bribery\",\"Category: Adverse Media | Subcategory: Corruption\",\"Category: Adverse Media | Subcategory: Fraud\",\"Category: Adverse Media | Subcategory: Money Laundering\",\"Category: Adverse Media | Subcategory: Tax Evasion\",\"Category: PEP | Subcategory: Intl Org Leadership\",\"Category: PEP | Subcategory: Senior Party Member\",\"Last updated: 2020-01-10\",\"Profile Notes: According to repubblica.it; March 07, 2019: In March, 2019 Berlusconi Silvio was placed under investigation for corruption, regarding the sentence of the Council of State, on March 03, 2016, when some judges cancelled the decision imposed to Berlusconi Silvio, to sell shares of a bank. Initially, for him this case was already filled. According to cbc.ca; November 16, 2018 On November 16, 2018 the prosecutors sent Silvio Berlusconi to trial for allegedly bribing a businessman in order to lie regarding the accusations that Berlusconi had been supplied with prostitutes 10 years ago at his parties. Allegedly, Berlusconi had given the businessman EUR 500,000. The trial is due to begin on February 4, 2019, in Bari. According to ilpost.it; May 12, 2018: On May 11, 2018 the Milan Surveillance Court upheld the rehabilitation request that Berlusconi had presented in March, 2018, making it eligible for immediate effect. Berlusconi Silvio was sentenced in 2013 and banned from public offices until November 2019. The Prosecutors from Milan could make an appeal to the Supreme Court. According to ilpost.it; March 26, 2018: In March, 2018, Silvio Berlusconi was sent on trial in the case called 'Ruby', for corruption. He is accused of having given EUR 400,000 and other assets to four women, in order not to declare some things to the judiciary during the 'Ruby trial', which ended in 2015 with the acquittal of Berlusconi. The trial will begin on May 9, 2018. According to dw.com; December 01, 2017: On December 01, 2017, Silvio Berlusconi was charged with bribery by the Court of Siena regarding the pianist that played during the 'bunga bunga' parties. The ex-prime minister allegedly paid EUR 3,000 for a favorable testimony. The trial will start in February, 2018. According to napolitoday.it; April 20, 2017: In April, 2017 due to the Italian statute of limitations, the Court of Appeal of Naples cancelled the sentence of three years received by Silvio Berlusconi in July, 2016 for bribing Italian Senators between 2006 and 2008. According to ilsecoloxix.it; April 20, 2017: In April, 2017 the Prosecution of Turin formally closed the investigation in which Silvio Berlusconi is accused of corruption and will most likely be followed by an indictment. According to straitstimes.com; April 05, 2017: On April 05, 2017 a judge from the Court of Milan ruled that the case in which Silvio Berlusconi is accused of paying more than EUR 10,000,000 to witnesses for favorable testimonies, should be fused with the trial of 22 individuals accused of taking bribes from the former Prime Minister and will start on July 03, 2017. According to torino.repubblica.it; February 24, 2017: In February, the Prosecution of Turin opened a new investigation involving Silvio Berlusconi, who is accused of corruption, in connection to sums of money given to a former nurse and model in order to falsely testify in the 'Ruby ter' trial. According to bbc.com; January 28, 2017: In January, 2017 Silvio Bersuconi was indicted for corruption. He was charged with bribing witnesses to lie about him having sex with a minor in 2010, during one of his \\\"bunga-bunga\\\" parties, crime for which he was convicted in 2013 but acquitted after the appeal in 2015. According to the media, between 2011 and 2015, Bersuconi paid more than EUR 10,000,000 for favorable testimonies. The trial will start on April 5, 2017. According to sputniknews.com; October 02, 2015: Milan Court reportedly seeks access to Berlusconi’s telephone call data amid witness bribing accusations he is facing. According to espresso.repubblica.it; July 09, 2015: In July, 2015 the Italian Prime Minister Silvio Berlusconi has been sentenced to three years of imprisonment for bribing a senator who facilitated the collapse of the government of Romano Prodi in 2008. According to the Court of Naples, Berlusconi managed to bring down the government of Prodi to buy the vote of a senator, who left his party, Italy of Values, which was part of the government coalition, to join the then ranks of Berlusconi's People of Freedom. According to askanews.it; June 24, 2015: On June 24, 2015 the Italian Prosecutors requested five years imprisonment for Silvio Berlusconi, in relation to an alleged corruption of senators. According to the charges, the former Premier managed to bring down Romano Prodi's government by buying the votes of several senators. The sentence related to the trial has been scheduled for July 8, 2015. According to adnkronos.com; January 14, 2015: The Italian Court of Cassation upheld a travel ban against former Premier Silvio Berlusconi, which came as part of his conviction in for tax fraud. According to media sources, Berlusconi's lawyers appealed the travel ban because the politician wanted to attend a EPP congress, set in Dublin. According to repubblica.it; April 15, 2014: Court of Supervision of Milan accepted Silvio Berlusconi's request to serve the year remaining on his tax-fraud sentence by doing community service and affirmed that the former premier will in a facility for the elderly, one day a week. The court additionally ruled that Berlusconi must stay in the region of Lombardy, although he will be allowed to go to Rome between Tuesday and Thursday each week. According to ilgiornale.it; April 10, 2014: Prosecutors in Milan accepted Silvio Berlusconi's request to serve the ten months remaining on a four-year tax-fraud conviction by doing community service. According to the Prosecutors, the Court of Supervision of Milan will decide the final verdict, which could take as long as five days to reach. According to repubblica.it; March 31, 2014: On March 31, 2014 the Second Court of Appeal of Milan ruled that the charge against Silvio and Paolo Berlusconi for involvement in the publication of an illegally obtained phone wiretapping, is lapsed due to the statute of limitation. The Court additionally upheld an EUR 80.000 compensation award for the aggrieved, Piero Fassino. According to tg24.sky.it; March 18, 2014: The Italian Supreme Court of Cassation has upheld a two-year ban from public office imposed on former Prime Minister Silvio Berlusconi after he was found guilty of tax fraud. The ban will make Berlusconi unable to stand in elections for the European Parliament in May 2014. According to internazionale.it; February 11, 2014: The trial into allegations former premier Silvio Berlusconi bribed a former senator to change political sides has begun on February 11, 2014. Mr. Berlusconi is accused of paying the senator a bribe of EUR 3,000,000 to leave the Centre-Left and join the Centre-Right, helping to amplify the crisis of the last government of Romano Prodi. Mr. Berlusconi will face this trial along with his former associate Valter Lavitola, accused for acting as a go-between the former premier and the former senator. According to huffingtonpost.it; November 27, 2013: On November 27, 2013 the Italian Senate voted to eject ex-premier Silvio Berlusconi after the supreme court upheld a tax-fraud conviction against him in August, making it definitive. According to corriere.it; October 23, 2013: The Court of Naples indicted Silvio Berlusconi and his former associate, Valter Lavitola. According to the Court, Berlusconi allegedly bribed a senator to join his party's ranks, and Lavitola acted as middleman. The trial against Berlusconi and Lavitola will begin February 11, 2014. According to huffingtonpost.it; Odtober 19, 2013: On October 19, 2013, the Court of Appeal of Milan ordered a two-year ban from parliament and elections against Silvio Berlusconi. The ruling is part of the tax fraud case against the former Prime Minister. According to media sources, Court's decision will have no immediate effect and his expulsion from the Parliament, but will depend on a separate vote in the Senate, expected to take place in November 2013. According to repubblica.it; October 04, 2013: A Senate commission voted in favor of stripping Silvio Berlusconi of his parliamentary seat in relation to the supreme court tax-fraud conviction against the former premier in August. To become effective, the decision needs to be ratified by the Italian Senate. According to ilsole24ore.com; August 08, 2013: A Senate commission has given Silvio Berlusconi 20 days to prepare a defense dossier to keep his seat of senator after the supreme court upheld a tax-fraud conviction against him. The commission will meet on September 9, 2013. According to media sources, Berlusconi risks being expelled from the Senate even if the five-year ban on holding public office that came with the conviction is sent back to the Milan appeals court for review. According to ilfattoquotidiano.it; August 01, 2013: Silvio Berlusconi will spend his remaining year of tax-fraud conviction in either under house arrest or community services. According to ilfaroonline.it; August 01, 2013: On August 1, 2013 the Italian Supreme Court of Cassation upheld a tax-fraud conviction against former premier Silvio Berlusconi. Three years of the sentence are not effective because of the 2006 amnesty. The court additionally suspended a five-year ban on Berlusconi holding public office, and sent it back to the Court of Appeal of Milan for a further review. According to repubblica.it; July 29, 2013: The Judges of the Italian Supreme Court of Cassation began the final review regarding whether to uphold a four-year tax-fraud conviction against the former premier Silvio Berlusconi. If the Cassation upholds the verdict, the prison term and a five-year ban from holding public office for Berlusconi will become definitive. According to the Judges, the decision will be made by July 31, 2013 and August 8, 2013. According to ilgiornale.it; July 17, 2013: The national council in charge of elections and parliamentary immunities (Giunta delle elezioni e delle immunità parlamentari) will vote whether or not to ban Silvio Berlusconi from holding any public office in relation to his ownership of several media. The council will meet a total of three times between July and August 2013. The first meeting has been scheduled for July 24, 2013. The final vote will take place in September 2013. According to repubblica.it; July 09, 2013: The supreme Court of Cassation set July 30, 2013 as the starting date for the final appeals trial regarding Berlusconi's conviction on tax-dodging through the manipulation of film rights for Mediaset. According to repubblica.it; June 17, 2013: Silvio Berlusconi has been placed under investigation by the Irish Garda Bureau of Fraud Investigations, because of suspected of tax evasion and money laundering. According to the Irish authorities, the investigation began after the Italian authorities required additional information regarding suspected transactions between Berlusconi and the International Financial Services Centre of Dublin. The transactions were executed between 2005 and 2007, estimated in around EUR 500,000,000, and are suspected to have been sent in several different off shore accounts. According to ansa.it; May 23, 2013: Milan judges affirmed that Silvio Berlusconi was involved in a fraud at his media company Mediaset during his mandate of prime minister. According to inviatospeciale.com; May 10, 2013: The Prosecutors of Naples requested that Silvio Berlusconi to be sent to trial over allegations that the ex-premier bribed a former senator to change political sides with a EUR 3,000,000 kickback. Italian judges affirmed that the kickback was split in several payments between 2006 and 2008. According to milano.repubblica.it; May 08, 2013: The Court of Appeal of Milan has upheld the tax fraud conviction and four year prison sentence against Silvio Berlusconi. The Court also barred the former Prime Minister from holding public office for five years and from managing any company for three years. According to ansa.it; April 11, 2013: A Bari court on April 11, 2013 accepted recordings of Silvio Berlusconi's telephone calls and messages as evidence in a case regarding accusations the ex-premier induced a witness to lie to investigators about his alleged sex parties. The wiretaps concerned communication between Berlusconi and an Italian model. According to ansa.it; March 19, 2013: A preliminary hearings judge has rejected a request from prosecutors for an immediate trial for Silvio Berlusconi over allegations the ex-prime minister bribed a former senator to change political sides. According to tg24.sky.it; March 11, 2013: In Naples prosecutors requested Berlusconi be immediately sent to trial on charges of corruption over a senator's change of political party. According to the reuters.com; March 07, 2013: An Italian court on March 7, 2013 sentenced former prime minister Silvio Berlusconi to a one-year jail term for making public the taped contents of a confidential phone call in a case related to a 2005 banking scandal. According to the globaltimes.cn; March 07, 2013: Italy's Court of Cassation on March 6, 2013 acquitted Silvio Berlusconi of an alleged fraud over inflated prices for television rights involving his Mediaset media company. According to ansa.it; March 01, 2013: A Milan prosecutor asked appeals court judges to uphold former Italian premier Silvio Berlusconi four year conviction for tax fraud in the trading of film rights for TV broadcasts by his media company, Mediaset. According to repubblica.it; February 28, 2013: Prosecutors in Naples opened a corruption probe against Silvio Berlusconi. According to the prosecutors, the former minister bribed a senator, in order to pass on his side, from Italy of Values party to the People of Freedom party. According to ilsecoloxix.it; February 22, 2013: The Rome prosecutor's office opened a probe into an election letter sent to millions of Italians signed by former premier Silvio Berlusconi about an IMU property-tax rebate. The probe was instigated by a candidate for the regional council in Lazio province, Gianfranco Mascia of the Civic Revolution Party, who charged in a letter to prosecutors that Berlusconi's campaign promise to refund the hated housing tax amounts to money for votes. According to ilfattoquotidiano.it; January 25, 2013: A Milan court rejected former premier Silvio Berlusconi's request to suspend his Mediaset appeal trial until after general elections at the end of February. Berlusconi is appealing a one-year sentence for tax fraud on film rights for his Mediaset TV group. According to ansa.it; December 20, 2012: A Milan prosecutor requested ex-premier Silvio Berlusconi to be sent to prison for one-year for involvement in the publication of an illegally obtained wiretap, in his brother's newspaper, Il Giornale. The prosecutor requested a jail term of three years and three months for Berlusconi's brother. A verdict on the trial is expected to be given in January. According to repubblica.it; October 26, 2012: A Milan Court sentenced former Prime Minister Silvio Berlusconi to four years in jail but later cut it to one year because of an amnesty law, for tax fraud during the period 2002 - 2003. The president of Berlusconi's Mediaset group was acquitted in the six-year old trial. The former Prime-Minister and others were accused of buying US film rights at inflated prices via two offshore companies under his control , in order to create slush funds. The judges ordered Berlusconi and his co-defendants to pay EUR 10,000,000 in damages and banned him from holding public office for three years. In 1997 he received a suspended sentence for false book-keeping but that conviction was reversed on appeal. According to ilsecoloxix.it; April 19, 2012: Silvio Berlusconi, former head of the government of Italy is suspected by prosecutors in Bari of having incited Gianpaolo Tarantini to lie for EUR 850,000. According to bbc.co.uk; February 02, 2012: Silvio Berlusconi is accused with abuse of office in connection with the publication of revealing a secret wiretap in 2005. The trial has began on March 15, 2012. According to bbc.co.uk; July 09, 2011: On July 9, 2011, Fininvest, a media holding company of Italian Prime Minister Silvio Berlusconi was ordered to pay EUR 560,000,000 in damages to a business rival media group, Compagnie Industirali Riunite (CIR), after Fininvest bribed a judge in 1991, to approve a company takeover. According to thehindu.com; October 16, 2010: Silvio Berlusconi and his son, deputy chairman of Mediaset are under investigation for tax evasion linked to his Mediaset media empire. According to guardian.co.uk; March 06, 2006: On March 10, 2006 Silvio Berlusconi was accused of corruption by the prosecutors in Milan. Political Party: Forza Italia (FI); Il Popolo della Liberta (PdL) (Former). Career: Member of the European Parliament (July 02, 2019 - July, 2024); President of Forza Italia Party, effective from September 18, 2013; Parliament of Italy, Senate, from Molise (March 01, 2013 - November 27, 2013); Acting Minister of Economic Development (May 05, 2010 - October 04, 2010); President of Il Popolo della Libertà (2009 - 2013); Prime Minister of Italy (May 07, 2008 - November 16, 2011); Parliament of Italy, Chamber of Deputies, from Molise (April 22, 2008 - March 14, 2013); Acting Minister of Economy and Finance (May 05, 2006 - May 17, 2006); Acting Minister of Health (March 11, 2006 - May 17, 2006); Prime Minister of Italy (June 10, 2001 - May 17, 2006); Acting Minister of Economy and Finance (July 03, 2004 - July 16, 2004); Acting Minister of Foreign Affairs (January 06, 2002 - November 14, 2002); Parliament of Italy, Chamber of Deputies, from Campania (April 21, 2006 - April 28, 2008); Parliament of Italy, Chamber of Deputies, from Lombardy (May 02, 1996 - April 27, 2006); Member of the European Parliament (July 20, 1999 - June 10, 2001); Parliament of Italy, Chamber of Deputies, from Lazio (April 03, 1994 - May 08, 1996); Prime Minister of Italy (May 10, 1994 - January 17, 1995).\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=24b7177a-4f8a-4c71-be41-1b1d278587ca\",\"Sources: https://multimedia.europarl.europa.eu/en/silvio-berlusconi-official-portrait-9th-parliamentary-term_20190620_BERLUSCONI_Silvio_IT_025_p\",\"Sources: https://multimedia.europarl.europa.eu/en/italian-meps-official-portrait-9th-parliamentary-term_EP-089406H_9th_MEP_Official_italy_c\",\"Sources: http://www.rainews.it/dl/rainews/media/Parlamento-europeo-2019-2024-Ecco-chi-sono-i-73-italiani-eletti-916b7d2d-adb8-422b-ae07-df6459c99e56.html#foto-1\",\"Sources: https://www.open.online/2019/05/28/chi-sono-gli-eurodeputati-eletti-in-italia-ecco-la-lista-completa/\",\"Sources: https://ukandeu.ac.uk/explainers/11-things-you-need-to-know-about-the-european-elections/\",\"Sources: http://www.europarl.europa.eu/news/en/press-room/elections-press-kit/0/key-dates-ahead\",\"Sources: http://www.tusciaweb.eu/2019/03/silvio-berlusconi-indagato-ex-pm-viterbese-fabrizio-tucci/\",\"Sources: https://it.geosnews.com/p/it/lazio/vt/silvio-berlusconi-indagato-dal-pm-viterbese-fabrizio-tucci_23474346\",\"Sources: https://www.ilfattoquotidiano.it/2019/03/07/berlusconi-indagato-per-corruzione-in-atti-giudiziari-nellinchiesta-a-roma-sulle-sentenze-pilotate-del-consiglio-di-stato/5022118/\",\"Sources: https://www.repubblica.it/politica/2019/03/07/news/corruzione_sentenze_cds_berlusconi_indagato_a_roma-220966197/\",\"Sources: https://tech2.org/italy/silvio-berlusconi-serious-front-for-banca-mediolanum-and-doris-assault-takes-off-resumes/\",\"Sources: http://www.europarl.europa.eu/meps/it/4391/SILVIO_BERLUSCONI/history/5#mep-card-content\",\"Sources: http://www.pdl.it/notizie/15381/ufficio-di-presidenza\",\"Sources: http://www.forzaitalia.it/notizie/10581/camera-dei-deputati-i-deputati-di-forza-italia-il-popolo-della-liberta-berlusconi-presidente\",\"Sources: https://www.ilfattoquotidiano.it/wp-content/uploads/2012/10/patto-berlusconi.pdf\",\"Sources: https://adesioneonline.forzaitalia.it/adesione.php\",\"Sources: http://www.treccani.it/enciclopedia/popolo-della-liberta/\",\"Sources: http://www.today.it/politica/elezioni-2013/simboli-pdl-berlusconi-presidente.html\",\"Sources: http://web.archive.org/web/20180606063410/https://www.cia.gov/library/publications/resources/the-world-factbook/fields/2118.html\",\"Sources: https://www.cbc.ca/news/world/italy-berlusconi-trial-ordered-1.4908629\",\"Sources: http://www.liberoquotidiano.it/news/politica/13338565/silvio-berlusconi-riabilitato-pg-15-giorni-tempo-ricorso-cassazione-rischio-sentenza-sfavorevole.html\",\"Sources: https://www.ilpost.it/2018/05/12/berlusconi-candidabile/\",\"Sources: http://www.ilgiornale.it/news/politica/ruby-ter-berlusconi-rinviato-giudizio-difesa-accuse-1509217.html\",\"Sources: https://www.ilpost.it/2018/03/26/silvio-berlusconi-rinviato-giudizio-ruby/\",\"Sources: http://www.thejournal.ie/berlusconi-witness-tampering-3726926-Dec2017/\",\"Sources: http://www.nation.co.ke/news/world/Silvio-Berlusconi-ordered-to-trial-over-witness-tampering/1068-4209972-2fgbirz/index.html\",\"Sources: http://www.dw.com/en/silvio-berlusconi-to-face-trial-for-bunga-bunga-bribe/a-41606876\",\"Sources: http://www.telegraph.co.uk/news/2017/06/26/kingmaker-silvio-berlusconis-party-triumphs-elections-italy/\",\"Sources: http://web.archive.org/web/20160203022416/http://leg16.camera.it/29?shadow_deputato=35330&idpersona=35330\",\"Sources: http://www.emarketstorage.com/storage/20160527/20160527_16687.1997675.pdf\",\"Sources: https://www.bancamediolanum.it/static-assets/documents/InfoEssenziali_ExArt130RE_15sett16.pdf\",\"Sources: http://www.europarl.europa.eu/portal/ro/contact\",\"Sources: http://www.senato.it/leg/17/BGT/Schede/Attsen/00000227.htm\",\"Sources: http://legxv.camera.it/cartellecomuni/leg15/include/contenitore_dati.asp?tipopagina=&deputato=d35330&source=%2Fdeputatism%2F240%2Fdocumentoxml%2Easp&position=Deputati\\\\La%20Scheda%20Personale&Pagina=Deputati/Composizione/SchedeDeputati/SchedeDeputati.asp%3Fdeputato=d35330\",\"Sources: http://legxiv.camera.it/organiparlamentari/assemblea/contenitore_dati.asp?tipopagina=&deputato=d35330&source=%2Fdeputatism%2F240%2Fdocumentoxml%2Easp&position=Deputati\\\\La%20Scheda%20Personale&Pagina=Deputati/Composizione/01.camera/nuovacomposizione/datpersonali2.asp%3Fdeputato=d35330\",\"Sources: http://leg13.camera.it/cartellecomuni/leg13/Deputati/scheda_deputato/scheda.asp?id=d00051\",\"Sources: http://legislature.camera.it/chiosco.asp?cp=1&position=XII%20Legislatura%20/%20I%20Deputati&content=deputati/legislatureprecedenti/Leg12/framedeputato.asp?Deputato=d35330\",\"Sources: https://web.archive.org/web/20140903040807/http://www.inviatospeciale.com/2013/05/berlusconi-dopo-la-condanna-un-rinvio-a-giudizio/\",\"Sources: https://web.archive.org/web/20130926050057/http://www.internazionale.it/news/italia/2013/09/18/il-videomessaggio-integrale-di-silvio-berlusconi/\",\"Sources: http://www.straitstimes.com/world/europe/former-italian-pm-silvio-berlusconis-bunga-bunga-bribery-trial-to-open-july\",\"Sources: http://www.liberoquotidiano.it/news/italia/12314496/ruby-ter-silvio-berlusconi-indagato-anche-a-torino.html\",\"Sources: http://www.ansa.it/piemonte/notizie/2017/04/20/ruby-torino-procede-contro-berlusconi_30dff0a9-85ac-4104-af7d-d56292744639.html\",\"Sources: http://www.ilsecoloxix.it/p/italia/2017/04/20/AS6IzQ4G-berlusconi_modella_infermiera.shtml\",\"Sources: http://torino.repubblica.it/cronaca/2017/02/24/news/torino_berlusconi_indagato_dalla_procura_subalpina_nell_ambito_del_processo_ruby_ter-159122741/\",\"Sources: http://www.ansa.it/sito/notizie/politica/2017/04/20/napoli-prescrizione-per-berlusconi_64bc9356-13b7-4e5b-8de3-58221670a3f1.html\",\"Sources: http://www.huffingtonpost.it/2017/04/20/prescrizione-per-il-processo-a-silvio-berlusconi-sulla-compraven_a_22048137/\",\"Sources: http://www.napolitoday.it/politica/compravendita-senatori-prescrizione-berlusconi.html\",\"Sources: http://www.europarl.europa.eu/portal/en/contact\",\"Sources: http://www.ilfattoquotidiano.it/2017/01/28/ruby-ter-berlusconi-rinviato-a-giudizio-per-corruzione-in-atti-giudiziari/3346677/\",\"Sources: http://www.agi.it/politica/2017/01/28/news/processo_ruby_ter_silvio_berlusconi_a_giudizio-1425743/\",\"Sources: http://www.ansa.it/sito/notizie/cronaca/2017/01/28/ruby-ter-silvio-berlusconi-rinviato-a-giudizio_e4bd24ab-a42f-4ad6-b09e-6d93d80bd721.html\",\"Sources: http://www.bbc.com/news/world-europe-38783586\",\"Sources: http://biografieonline.it/biografia.htm?BioID=958&biografia=Silvio+Berlusconi\",\"Sources: http://www.governo.it/i-ministeri-0\",\"Sources: http://www.iltempo.it/politica/2016/05/04/news/forza-italia-riprende-la-sede-a-piazza-san-lorenzo-in-lucina-1009035/\",\"Sources: https://web.archive.org/web/20140321183132/http://www.agi.it/politica/notizie/201403182159-pol-rt10214-berlusconi_2_anni_di_interdizione_cassazione_pena_ora_esecutiva\",\"Sources: http://www.today.it/politica/discorso-berlusconi-18-settembre-2013.html\",\"Sources: http://fakty.ua/206072-silvio-berluskoni-obyavlen-v-ukraine-personoj-non-grata\",\"Sources: http://www.unian.ua/society/1126498-berluskoni-zaboronili-vjizd-do-ukrajini-na-tri-roki-dokument.html\",\"Sources: http://www.prensa.com/judiciales/Italia-abdica-responsabilidad-caso-Finmeccanica_0_4321067962.html\",\"Sources: http://sputniknews.com/europe/20151002/1027881433.html\",\"Sources: http://espresso.repubblica.it/palazzo/2015/07/09/news/tre-milioni-di-euro-a-de-gregorio-berlusconi-condannato-per-compravendita-senatori-il-processo-sara-prescritto-1.220533\",\"Sources: http://www.azonline.de/Welt/Politik/2041793-Justiz-Berlusconi-wegen-Bestechung-eines-Senators-verurteilt\",\"Sources: http://www.thenational.ae/news/world/europe/berlusconi-under-investigation-for-tax-evasion\",\"Sources: http://www.telegraph.co.uk/news/worldnews/silvio-berlusconi/8974317/David-Mills-invented-Silvio-Berlusconi-bribe-claims.html\",\"Sources: http://www.ticinonews.ch/articolo.aspx?id=292953&rubrica=15\",\"Sources: http://www.thehindu.com/todays-paper/tp-international/berlusconi-faces-tax-evasion-inquiry/article833299.ece\",\"Sources: http://www.senato.it/leg/17/BGT/Schede_v3/Attsen/00000227.htm\",\"Sources: http://www.repubblica.it/politica/2012/10/26/news/mediaset_berlusconi_condannato-45374682/?ref=HREA-1\",\"Sources: http://www.reuters.com/article/2013/03/07/us-italy-berlusconi-trial-idUSBRE9260FG20130307\",\"Sources: http://www.repubblica.it/politica/2013/07/29/news/berlusconi_l_attesa_della_sentenza-63908290/\",\"Sources: http://www.repubblica.it/politica/2013/05/12/foto/guerra_dei_20_anni-58667431/1/\",\"Sources: http://www.repubblica.it/politica/2014/04/15/news/berlusconi_attesa_in_mattinata_decisione_su_servizi_sociali-83640001/?ref=HREA-1\",\"Sources: http://www.repubblica.it/politica/2014/03/31/news/unipol_pg_chiede_prescrizione_per_silvio_e_paolo_berlusconi-82370058/\",\"Sources: http://www.repubblica.it/politica/2013/10/04/news/decadenza_il_giorno_del_voto_prime_schermaglie_in_giunta-67864906/\",\"Sources: http://www.repubblica.it/politica/2013/07/09/news/mediaset_berlusconi_i More sources available\"]"
          },
          {
            "id": "dfd46e31-5e2c-4082-b2a3-0f4baae85cca",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Enforcement",
            "subcategory": "Disciplined",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "Rose, Timothy S.",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"S.\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Timothy\"},\"lastName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rose\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1966-06-19\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"19169 Morehead Road\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Wallingford\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"United States\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"5885113(ProprietaryUID)\"}}",
            "bridger_updated": "2019-09-10T00:00:00.000Z",
            "comments": "[\"Date listed: 2015-04-19\",\"Source: United States,US-U.S. Department of Health & Human Services\",\"Offense: Entity on the Excluded Party List of the United States Department of Health and Human Services - October 20, 2005.\",\"Category: Enforcement | Subcategory: Disciplined\",\"Category: Enforcement | Subcategory: Excluded Party\",\"Last updated: 2019-09-10\",\"Profile Notes: According to the US-The System for Award Management (SAM): Identification Information: Prefix: First Name:TIMOTHY Middle Name:S Last Name:ROSE Suffix: NPI: Exclusion Details: Exclusion Program:Reciprocal Classification Type:Individual Exclusion Type:Prohibition/Restriction Nature (Cause): May be subject to sanctions pursuant to the conditions imposed by the U.S. Department of the Treasury (Treasury) Office of Foreign Assets Control (OFAC), or subject to a sanction, restriction or partial denial pursuant to the conditions imposed by the U.S. Department of State (STATE) or Federal agency of the U.S. Government. Effect: If you think you have a potential match with an OFAC listing, please visit the following section of OFAC's website for guidance: http://www.treasury.gov/resource-center/faqs/Sanctions/Pages/directions.aspx . For all other prohibitions and restrictions, see the agency note in the Additional Comments field to ascertain the extent or limit on the sanction, restriction or partial denial. If there is no note, contact the agency taking the action for this information. Active Date:10/20/2005 Termination Date:Indefinite Excluding Agency :HEALTH AND HUMAN SERVICES, DEPARTMENT OF Status :Inactive Create Date :04/19/2007 Update Date :07/27/2012 Additional Comments:Excluded by the Department of Health and Human Services from participation in all Federal health care programs pursuant to 42 U.S.C. § 1320a-7 or other sections of the Social Security Act, as amended and codified in Chapter 7 of Title 42 of the United States Code (the scope and effect of Federal health care program exclusions is described in 42 C.F.R. § 1001.1901). Primary Address: City:WALLINGFORD State/Province:KY ZIP/Postal Code:41093 Country:UNITED STATES According to the U.S. Department of Health and Human Services (HHS): First Name: TIMOTHY Middle Name: S Last Name: ROSE Business: NURSING PROFESSION Specialty: NURSE/NURSES AIDE UPIN: N/A Address: 19169 MOREHEAD ROAD CSZ: WALLINGFORD, KY 41093 Exclusion Info Type: SECTION 1128(b)(4) Desc: License revocation/suspension/surrender Date: October 20, 2005 Status: Inactive\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=71ea3dae-8327-49c5-9f72-f64edd9d5697\",\"Sources: https://www.sam.gov/SAM/\",\"Sources: https://exclusions.oig.hhs.gov/Default.aspx\"]"
          },
          {
            "id": "bbcea173-d5ea-47aa-b953-6abc8342771f",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "PEP",
            "subcategory": "Mgmt Govt Corp",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "Rose, Clayton S.",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"S.\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Clayton\"},\"lastName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rose\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1958,1957\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"100 N Tryon Street\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Charlotte\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Norway,United States\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"9646935(ProprietaryUID)\"}}",
            "bridger_updated": "2018-12-31T00:00:00.000Z",
            "comments": "[\"Date listed: 2018-12-31\",\"Occupation: Member of the Board of Bank of America Corporation, effective from October 24, 2018.\",\"Source: International,Website\",\"Category: PEP | Subcategory: Mgmt Govt Corp\",\"Last updated: 2018-12-31\",\"Profile Notes: Career: Member of the Board of Bank of America Corporation, effective from October 24, 2018. Company Name: Bank of America Corporation.\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=2e56e156-64a0-449a-87ee-de77619bf545\",\"Sources: https://www.hhmi.org/about/leadership/trustees/clayton-s-rose\",\"Sources: https://www.wallstreet-online.de/nachricht/10956301-bank-of-america-names-clayton-s-rose-to-board-of-directors\",\"Sources: https://www.marketwatch.com/press-release/bank-of-america-names-clayton-s-rose-to-board-of-directors-2018-10-24-10159472\",\"Sources: https://www.marketscreener.com/business-leaders/Clayton-Rose-4176/biography/\",\"Sources: https://www.marketscreener.com/BANK-OF-AMERICA-11751/news/Bank-of-America-Names-Clayton-S-Rose-to-Board-of-Directors-27478013/\",\"Sources: https://www.businesswire.com/news/home/20181024005605/en/Bank-America-Names-Clayton-S.-Rose-Board\",\"Sources: https://sociology.sas.upenn.edu/content/penn-sociology-phd-graduate-clayton-s-rose-elected-president-bowdoin-college\",\"Sources: http://investor.bankofamerica.com/phoenix.zhtml?c=71595&p=irol-govboard#fbid=s1limV8uupx\"]"
          },
          {
            "id": "b3e81984-9ac4-4d53-8c56-80aa68da9d06",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Adverse Media",
            "subcategory": "Drug Trafficking",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "De Rosa, Silvio",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Silvio\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rosa\"},\"lastName\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"De\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1991-02-23\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Naples\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Italy\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"10969394(ProprietaryUID)\"}}",
            "bridger_updated": "2020-09-02T00:00:00.000Z",
            "comments": "[\"Date listed: 2020-09-02\",\"Source: International,Website\",\"Offense: Arrested for organized crime, drug trafficking and extortion - December 2018.\",\"Category: Adverse Media | Subcategory: Drug Trafficking\",\"Category: Adverse Media | Subcategory: Extort-Rack-Threats\",\"Category: Adverse Media | Subcategory: Organized Crime\",\"Last updated: 2020-09-02\",\"Profile Notes: According to internapoli.it; December 12, 2018: In December 2018, the Carabinieri of the Provincial Command of Naples have executed an Ordinance of Custody issued by the GIP of Naples against 52 persons, including Silvio De Rosa, for accusations of mafia-type associations, sale of drugs, extortion, robbery and illegal possession and receiving of firearms. The individuals were linked to the Camorra Soccavo mafia. The precautionary measures were issued following the investigations done in July 2013 by the District Anti-Mafia Directorate of Naples, after the murder of a Camorra mafia member and allowed the authorities to document the rise of the 'Vigilia' Camorra clan in neighborhood after its split from the 'Grimaldi' clan. A drug supply and sorting system had been set up by the criminals that started from a dense network of 'dealing squares' in Soccavo with the help of drug dealers and messengers that managed to distribute considerable quantities of drugs. A robbery and an attempted extortion have been ascertained with a request for EUR 2,400 against a drug dealer who was not part of the Camorra clan.\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=817701ed-6257-40a4-a408-ef920f42c298\",\"Sources: https://www.cronachedellacampania.it/2018/12/camorra-le-minacce-ai-pentiti-e-ai-parenti-sgominati-i-clan-grimaldi-vigilia-e-sorianiello-52-indagati-tutti-i-nomi/?refresh_ce\",\"Sources: https://internapoli.it/camorra-soccavo-nomi-e-foto-degli-arrestati-nella-retata-contro-i-vigilia/\"]"
          },
          {
            "id": "a9185f03-88d5-490c-bb6d-91497eef359f",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Enforcement",
            "subcategory": "Debarred",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "Rose, Jerelle S",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"S\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Jerelle\"},\"lastName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rose\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Silvis\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"United States\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"12014793(ProprietaryUID)\"}}",
            "bridger_updated": "2022-02-08T00:00:00.000Z",
            "comments": "[\"Date listed: 2022-02-08\",\"Source: United States,US-Illinois Department of Financial & Professional Regulation\",\"Offense: Permanent employee registration card suspended for failing to file and/or pay Illinois state income taxes - December 20, 2021.\",\"Category: Enforcement | Subcategory: Debarred\",\"Last updated: 2022-02-08\",\"Profile Notes: According to U.S. Illinois Department of Financial & Professional Regulation; December 2021: On December 20, 2021, permanent employee registration card of Jerelle Rose was suspended for failure to file and/or pay Illinois state income taxes. License Number: 129405461.\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=ba3d28be-311e-475f-b8bb-d0b63cc19771\",\"Sources: https://www.idfpr.com/Forms/DISCPLN/2021_12enf.pdf\",\"Sources: https://online-dfpr.micropact.com/lookup/licenselookup.aspx\"]"
          },
          {
            "id": "8e940562-c9e4-41c3-bbb1-85ccd6c6d06b",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Adverse Media",
            "subcategory": "Drug Trafficking",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "Roseo, Silvio",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Silvio\"},\"middleName\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"lastName\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Roseo\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1990,1989\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Anzio\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Italy\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"12071068(ProprietaryUID)\"}}",
            "bridger_updated": "2022-03-10T00:00:00.000Z",
            "comments": "[\"Date listed: 2022-03-10\",\"Source: International,Website\",\"Offense: Under investigation for drug trafficking, organized crime, extortion, environmental crimes and fraud – February 17, 2022.\",\"Category: Adverse Media | Subcategory: Drug Trafficking\",\"Category: Adverse Media | Subcategory: Environmental Crimes\",\"Category: Adverse Media | Subcategory: Extort-Rack-Threats\",\"Category: Adverse Media | Subcategory: Fraud\",\"Category: Adverse Media | Subcategory: Organized Crime\",\"Last updated: 2022-03-10\",\"Profile Notes: According to calabria7.it and latinaoggi.eu; February 17, 2022: On February 17, 2022, a large number of subjects were arrested as part of the operation called ‘Tritone’ coordinated by the Rome Anti-Mafia District Directorate. According to the media source, the operation led to the vanquishing of an alleged criminal association that assumed control of the southern coast of Rome. They would have been infiltrated in the public administration and would have managed international drug trafficking operations. The prosecutors also investigate the suspects for aggravated extortion and illegal possession of firearms, fictitious registration of goods and activities organized for the illicit trafficking of waste aggravated by the mafia method. Among the investigated individuals is also Silvio Roseo.\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=29083b71-8740-4d3a-8a2c-9527160cece7\",\"Sources: https://latinatu.it/la-ndrina-di-anzio-e-nettuno-coinvolge-aprilia-tra-smercio-di-droga-e-sversamenti-di-liquami/\",\"Sources: https://www.latinaoggi.eu/news/cronaca/204285/la-ndrangheta-sul-litorale-ecco-tutti-i-nomi-delle-persone-coinvolte\",\"Sources: https://calabria7.it/maxi-blitz-contro-la-ndrangheta-a-roma-e-provincia-gli-indagati-sono-74-nomi/\"]"
          },
          {
            "id": "8a3a1be5-9cfd-4d9a-b5a4-684a3de653ff",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Enforcement",
            "subcategory": "Disciplined",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "Rose, Quisha S.",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"S.\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Quisha\"},\"lastName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rose\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Philadelphia\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"United States\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1016777(ProprietaryUID)\"}}",
            "bridger_updated": "2014-11-17T00:00:00.000Z",
            "comments": "[\"Date listed: 2006-12-10\",\"Source: United States,US –Financial Industry Regulatory Authority\",\"Offense: Censured, fined $20,000 and barred from FINRA membership - March, 1998 (Starting March, 1998)\",\"Category: Enforcement | Subcategory: Disciplined\",\"Last updated: 2014-11-17\",\"Profile Notes: According to the US-Financial Industry Regulatory Authority; March, 1998: Quisha S. Rose (Associated Person, Philadelphia, Pennsylvania) was censured, fined $20,000, and barred from association with any NASD member in any capacity. The sanctions were based on findings that Rose failed to respond to NASD requests for information.\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=b7108c42-0eca-48a7-a3e7-b867ed46ce64\",\"Sources: http://www.finra.org/web/groups/industry/@ip/@enf/@da/documents/disciplinaryactions/p007562.pdf\",\"Sources: https://members.worldcompliance.com/Article.aspx?id=a9c703a0-5767-4939-a9c7-4254a927b462\",\"Sources: http://www.nasdr.com/pdf-text/9803dis.txt\"]"
          },
          {
            "id": "8800aacc-8cd2-4a0f-9973-9191631160df",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Enforcement",
            "subcategory": "Bank Fraud",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "Rose, Erica S",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"S\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Erica\"},\"lastName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rose\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1990,1989\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"122 Lincoln Place Court,1222 SPRUCE ST\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Belleville,East St. Louis,St. Louis\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"United States\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"14658-025(Other) | 10490247(ProprietaryUID)\"}}",
            "bridger_updated": "2022-01-11T00:00:00.000Z",
            "comments": "[\"Date listed: 2020-01-30\",\"Source: United States,US-United States Attorney - Southern District of Illinois\",\"Offense: Sentenced to one year and one day in prison for bank fraud, fraud, conspiracy and wire fraud - January 23, 2020.\",\"Category: Enforcement | Subcategory: Bank Fraud\",\"Category: Enforcement | Subcategory: Conspiracy\",\"Category: Enforcement | Subcategory: Fraud\",\"Category: Enforcement | Subcategory: Wire Fraud\",\"Last updated: 2022-01-11\",\"Profile Notes: According to Federal Bureau of Prison; As of January 11, 2022: Name: ERICA S ROSE Register Number: 14658-025 Age: 32 Race: Black Sex: Female Located at: St Louis RRM Release Date: 04/14/2022 According to United States Attorney - Southern District of Illinois: April 22, 2021: On April 22, 2021, Erica S Rose was sentenced to one year and one day in federal prison and two years of court supervision after her release for conspiracy to commit bank fraud and wire fraud and aggravated identity theft last November. In 2018, Rose worked for a company called CareLink and gained access to the homes of her elderly victims as their hired caretaker. While inside, she stole social security numbers and other identifying information and passed the stolen information along to her co-defendant, Ashley McKinney. McKinney allegedly used victims’ funds and identities to withdraw money from ATMs, deposit fraudulent checks, and even purchase a car online for over USD 28,000. Rose was ordered to pay USD 9,864.71 in restitution. According to United States Attorney - Southern District of Illinois: January 28, 2020: Erica S Rose and Ashley N McKinney were indicted for conspiring to commit bank and wire fraud, aggravated identity theft, and other felony offenses. Rose used her employment with a Belleville-based in-home health care provider to gain access to the homes of elderly clients in Southern Illinois, where she stole bank account numbers and other identifying information. The indictment further alleges that Rose provided the stolen materials to McKinney, who withdrew money from ATMs, deposited fraudulent checks, and even purchased a car online for over USD 28,000 all using the elderly victims’ funds and identities. According to United States Attorney - Southern District of Illinois: January 23, 2020: Erica S Rose and Ashley N McKinney were charged with conspiring to commit bank and wire fraud.\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=1dfbb9c0-5151-4318-84c4-bc145916d87d\",\"Sources: https://www.justice.gov/usao-sdil/pr/east-stlouis-caretaker-sentenced-prison-stealing-identities-elderly-clients\",\"Sources: https://www.justice.gov/civil/page/file/1254486/download\",\"Sources: https://www.bbb.org/us/il/belleville/profile/home-health-care/carelink-0734-310367554\",\"Sources: https://www.care.com/b/l/carelink-of-metro-east/belleville-il\",\"Sources: https://www.bnd.com/news/local/crime/article239716498.html\",\"Sources: https://www.tribuneledgernews.com/extra/news/healthcare-worker-accomplice-charged-with-stealing-from-elderly-clients-in/article_01f434f4-6206-5493-9780-5af6368858f4.html\",\"Sources: https://www.mdjonline.com/neighbor_newspapers/extra/news/two-women-charged-with-stealing-from-elderly-health-care-clients/article_9bcdd1e3-b7bd-56a5-9876-ce8ca402271d.html\",\"Sources: https://www.stltoday.com/news/local/crime-and-courts/two-women-charged-with-stealing-from-elderly-health-care-clients/article_b3179f6c-075d-5908-a20c-04842af639db.html\",\"Sources: https://www.stl.news/east-saint-louis-caretaker-and-accomplice-erica-s-rose-indicted-for-stealing-identities-and-defrauding-elderly-clients/308399/\",\"Sources: https://www.edglentoday.com/articles/details/east-st-louis-caretaker-and-accomplice-indicted-for-stealing-identities-and-defrauding-elderly-clients-39370.cfm\",\"Sources: https://www.mdjonline.com/neighbor_newspapers/extra/news/two-health-care-workers-charged-with-stealing-from-elderly-clients/article_9bcdd1e3-b7bd-56a5-9876-ce8ca402271d.html\",\"Sources: https://www.newspressnow.com/news/national/healthcare-worker-accomplice-charged-with-stealing-from-elderly-clients-in/article_33b20b09-fe8d-5c20-bce2-79431d383b10.html\",\"Sources: https://www.tribuneledgernews.com/extra/news/two-women-charged-with-stealing-from-elderly-health-care-clients/article_01f434f4-6206-5493-9780-5af6368858f4.html\",\"Sources: https://www.kmov.com/news/metro-east-caretaker-accomplice-accused-of-stealing-elderly-clients-identities/article_e37ded60-41dc-11ea-81e9-e3b9fbad7c04.html\",\"Sources: https://www.ibjonline.com/2020/01/28/east-st-louis-caretaker-accomplice-indicted-for-defrauding-elderly-clients/\",\"Sources: https://www.justice.gov/usao-sdil/pr/east-saint-louis-caretaker-and-accomplice-indicted-stealing-identities-and-defrauding\",\"Sources: https://www.bop.gov/locations/ccm/cst/\",\"Sources: https://www.bop.gov/inmateloc/\"]"
          },
          {
            "id": "7913ba13-9ea3-4570-bded-ae5b757749ec",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Enforcement",
            "subcategory": "Conspiracy",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "Rose, Richard S",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"S\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Richard\"},\"lastName\":{\"matchCriteria\":\"Exact\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rose\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"1956,1955\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"city\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Missouri City\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"United States\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"07461-579(Other) | 10427030(ProprietaryUID)\"}}",
            "bridger_updated": "2022-01-10T00:00:00.000Z",
            "comments": "[\"Date listed: 2019-12-23\",\"Source: United States,US-United States Attorney - Southern District of Texas\",\"Offense: Sentenced to 36 months in prison for conspiracy, mail fraud and embezzlement - December 01, 2021.\",\"Category: Enforcement | Subcategory: Conspiracy\",\"Category: Enforcement | Subcategory: Embezzlement\",\"Category: Enforcement | Subcategory: Fraud\",\"Category: Enforcement | Subcategory: Money Laundering\",\"Category: Enforcement | Subcategory: Wire Fraud\",\"Last updated: 2022-01-10\",\"Profile Notes: According to U.S Federal Bureau of Prisons; as of January 10, 2022: Name: Richard S Rose Register Number: 07461-579 Age: 65 Sex: Male NOT IN BOP CUSTODY Release Date: UNKNOWN According to United States Attorney - Southern District of Texas, U.S. Secret Service and U.S. Internal Revenue Service; December 01, 2021: On December 01, 2021, Richard Rose was sentenced to 36 months in prison for conspiracy to commit mail fraud and further ordered Rose to pay restitution of USD 335,439. On August 17, 2021, Richard Rose pleaded guilty to the charges. According to United States Attorney - Southern District of Texas and U.S. Internal Revenue Service; December 18, 2019: On December 18, 2019, Richard S. Rose was charged with conspiracy, wire fraud, fraud , money laundering and false bankruptcy declarations. Rose was the founder of Zoe Learning Academy and served in various capacities to include superintendent Rose allegedly embezzled funds intended for the charter school’s operation and used them for his personal expenses such as legal fees, a lawsuit settlement and for the purchase of a timeshare. The indictment also alleges that after Zoe ceased operations, Rose, as Zoe’s agent, filed for bankruptcy and made various false statements\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=1e747d3e-8d10-4de4-a367-01eb9c4a4f28\",\"Sources: https://www.secretservice.gov/newsroom/releases/2021/12/former-charter-school-official-sent-prison\",\"Sources: https://www.irs.gov/compliance/criminal-investigation/former-charter-school-official-sent-to-prison\",\"Sources: https://www.click2houston.com/news/local/2021/12/01/former-charter-school-founder-sentenced-to-3-years-in-prison-for-mail-fraud-conspiracy/\",\"Sources: https://www.justice.gov/usao-sdtx/pr/former-charter-school-official-sent-prison\",\"Sources: https://www.irs.gov/compliance/criminal-investigation/educational-agency-leader-charged-in-financial-conspiracy\",\"Sources: https://www.journalgazette.net/opinion/20191221/government-inaction-on-wasteful-charter-spending\",\"Sources: https://www.click2houston.com/news/local/2019/12/18/founding-superintendent-of-zoe-learning-academy-faces-18-count-indictment-involving-financial-conspiracy/\",\"Sources: https://www.justice.gov/usao-sdtx/pr/educational-agency-leader-charged-financial-conspiracy\",\"Sources: https://www.bop.gov/inmateloc/\"]"
          },
          {
            "id": "6d12eb84-9d69-4ee7-9799-0a918fa753f4",
            "job_id": "8b6f0c03-cfa1-44bf-80b1-a8552616102c",
            "job_entity_id": "6e84f873-63f3-40f8-922a-f386de97337c",
            "updated_at": "2022-08-01T06:49:25.704Z",
            "database": "WorldCompliance",
            "category": "Enforcement",
            "subcategory": "Fraud",
            "match": "Very Low",
            "match_description": "Weak name match OR country mismatch OR Gender mismatch",
            "name": "M/s Rose Associates",
            "entity_type": "Individual",
            "mapped_entity_details": "{\"firstName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Associates\"},\"middleName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Rose\"},\"lastName\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"M/s\"},\"dateOfBirth\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"addressLine1\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"city\":{\"matchCriteria\":\"Not Available\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"\"},\"country\":{\"matchCriteria\":\"Different\",\"matchCriteriaNumeric\":0,\"matchedEntity\":\"Pakistan\"},\"id\":{\"matchCriteriaNumeric\":0,\"matchedEntity\":\"8989743(ProprietaryUID)\"}}",
            "bridger_updated": "2018-05-10T00:00:00.000Z",
            "comments": "[\"Date listed: 2018-05-10\",\"Source: Pakistan,PK-Pakistan National Accountability Bureau\",\"Offense: Accused of fraud - March 24, 2015.\",\"Category: Enforcement | Subcategory: Fraud\",\"Last updated: 2018-05-10\",\"Profile Notes: According to the PK - National Accountability Bureau; March 24, 2015: The Executive Board Meeting (EBM) of National Accountability Bureau (NAB) has decided to authorize inquiry against M/s Rose Associates and Chaudhry Muhammad Arif of PKR 308,861,000 of Saudi Pak Industrial and Agricultural Investment Company Limited SPAICO. In this case the accused persons were alleged for willful loan default.\",\"Sources: https://members.worldcompliance.com/metawatch2.aspx?id=09ca303b-ebb9-4799-8155-5eaee94a4b51\",\"Sources: http://www.nab.gov.pk/PRESS/NEW.ASP?942\"]"
          }
        ],
        "paging": {
          "nextPage": "0017000400000032106d12eb849d694ee797990a918fa753f4f07ffffff5f07ffffff5",
          "totalPages": 2,
          "totalRecordsAvailable": 11
        },
        "filtersData": {
          "databases": [
            "WorldCompliance"
          ],
          "categories": [
            "Adverse Media",
            "Enforcement",
            "PEP"
          ],
          "subcategories": [
            "Bank Fraud",
            "Bribery",
            "Conspiracy",
            "Debarred",
            "Disciplined",
            "Drug Trafficking",
            "Fraud",
            "Mgmt Govt Corp",
            "Securities Fraud"
          ]
        },
        "jobTitle": "Screening Sample Individual(new-updatedversion) v1.2 (4).csv",
        "jobEntityName": "Silvio Rose"
      }));
    } catch (e) {
      next(e);
    }
  }
}

const jobsController = new JobsController();
export default jobsController;
