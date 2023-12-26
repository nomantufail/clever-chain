import commonService from "./common.service";
import { EntityType } from "shared/enums";

class TagsMapperService {
  constructor() {}

  mapRecords(bridgerMatches: any, entity: any, entityType: string) {
    const mappedMatches: any[] = [];
    bridgerMatches.forEach((match: any) => {
      mappedMatches.push({
        intermediate_entity_record: JSON.stringify(match),
        intermediate_entity_record_parsed: match,
        intermediate_entity_details: '',
        mapped_entity_record: '',
        mapped_entity_details: JSON.stringify(this.extractRecordDetail(match, entity, entityType)),
        entity_risk_evaluation: '',
        entity_attr_risk_evaluation: '',
        name: match['BestName'],
        match: '',
        match_numeric: 0,
        entity_unique_id: match['EntityUniqueID'],
        bridger_updated: (match['EntityDetails'] && this.extractBriderUpdated(match['EntityDetails']['Comments'])) || '',
        database: 'WorldCompliance',
        category: (match['EntityDetails'] && this.extractCategory(match['EntityDetails']['Comments'])) || '',
        subcategory: (match['EntityDetails'] && this.extractSubCategory(match['EntityDetails']['Comments'])) || '',
        comments: this.mapComments(match['EntityDetails']),
        rawComments: (match['EntityDetails'] && match['EntityDetails']['Comments']) || '',
        additionalInfo: (match['EntityDetails'] && match['EntityDetails']['AdditionalInfo']) || [],
        allAddresses: commonService._getAllAddresses(match)
      });
    });
    return mappedMatches;
  }

  mapComments(entityDetails: any) {
    if (!entityDetails) {
      return [];
    }

    let finalComments = [];
    if (entityDetails['DateListed']) {
      finalComments.push(`Date listed: ${entityDetails['DateListed']}`)
    }

    if (Array.isArray(entityDetails['AdditionalInfo'])) {
      const occupation = entityDetails['AdditionalInfo'].find(info => info.Type === 'Occupation')
      if (occupation) {
        finalComments.push(`Occupation: ${occupation.Value}`)
      }
    }

    const commentParts = (entityDetails['Comments'] || '').split('||');
    finalComments = finalComments.concat(commentParts
      .map((str: any) => str.replace(/\s+/g, " ").trim())
      .filter((str: string) => !str.startsWith("Associations:")))

    if (Array.isArray(entityDetails['AdditionalInfo'])) {
      const sourcesInfos = entityDetails['AdditionalInfo'].filter((info) => {
        return info['Comments'] && (info['Comments'].includes('http') || (info['Comments'].includes('https')))
      })
      sourcesInfos.forEach((source) => {
        const sourceParts = source['Comments'].split('|');
        sourceParts.forEach((sourcePart: string) => {
          const trimmedSourcePart = sourcePart.replace(/\s+/g, " ").trim();
          if(trimmedSourcePart.includes('http') || trimmedSourcePart.includes('https')) {
            finalComments.push(`Sources: ${trimmedSourcePart}`);
          }
        });
      })

    }
    return JSON.stringify(finalComments);
  }

  extractRecordDetail(record: any, inputEntity: any, entityType: string) {
    return entityType === EntityType.Individual
      ? {
        firstName: {
          matchCriteria: '', //todo: leave it empty
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['First Name'],
          matchedEntity: commonService.getNamePart(record['BestName'], 'first'),
        },
        middleName: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Middle Name'],
          matchedEntity: commonService.getNamePart(record['BestName'], 'middle'),
        },
        lastName: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Last Name'],
          matchedEntity: commonService.getNamePart(record['BestName'], 'last'),
        },
        dateOfBirth: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Date of Birth'],
          matchedEntity: (record['EntityDetails'] && this.getMatchedDob(record['EntityDetails']['AdditionalInfo'])) || '',
        },
        addressLine1: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Address Line 1 - Current'],
          matchedEntity: (record['EntityDetails'] && this.getAddress(record['EntityDetails']['Addresses'], 'Street1')) || '',
        },
        city: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['City - Current'],
          matchedEntity: (record['EntityDetails'] && this.getAddress(record['EntityDetails']['Addresses'], 'City')) || '',
        },
        country: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Country - Current'],
          matchedEntity: record['EntityDetails'] && this.getAddress(record['EntityDetails']['Addresses'], 'Country'),
        },
        id: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Other Information'],
          matchedEntity: this.getId(record),
        },
      }
      : {
        registeredName: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Registered name'],
          matchedEntity: record['BestName'],
        },
        tradingName: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: '',
          matchedEntity: '',
        },
        ein: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['EIN'],
          matchedEntity: this.getId(record),
        },
        addressLine1: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Address Line 1 - Current'],
          matchedEntity: (record['EntityDetails'] && this.getAddress(record['EntityDetails']['Addresses'], 'Street1')) || '',
        },
        city: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['City - Current'],
          matchedEntity: (record['EntityDetails'] && this.getAddress(record['EntityDetails']['Addresses'], 'City')) || '',
        },
        country: {
          matchCriteria: '',
          matchCriteriaNumeric: 0,
          internalInfo: inputEntity['Country - Current'],
          matchedEntity: (record['EntityDetails'] && this.getAddress(record['EntityDetails']['Addresses'], 'Country')) || '',
        },
      };
  }

  getId(record: any) {
    let ids: string[] = [];
    if(record['EntityDetails'] && Array.isArray(record['EntityDetails']['IDs'])) {
      record['EntityDetails']['IDs'].forEach(item => ids.push(`${item.Number}(${item.Type})`));
    }
    return ids.join(' | ');
  }

  extractCategory(data: string) {
    let category = '';
    let temp: any;
    let dataArr = data.split('||');
    for (let str of dataArr) {
      if (str.search('Category') !== -1) {
        temp = str;
        temp = temp.split('|');
        temp = temp.map((item: any) => item.split(':'));
        category = temp[0][1];
        break;
      }
    }
    return category.trim();
  }

  extractSubCategory(data: string) {
    let subcategory = '';
    let temp: any;
    let dataArr = data.split('||');
    for (let str of dataArr) {
      if (str.search('Category') !== -1) {
        temp = str;
        temp = temp.split('|');
        temp = temp.map((item: any) => item.split(':'));
        subcategory = temp[1][1];
        break;
      }
    }
    return subcategory.trim();
  }
  /**
   * get brider last updated date
   */
  extractBriderUpdated(data: string) {
    let lastUpdated = '';
    let temp: any;
    let dataArr = data.split('||');
    for (let str of dataArr) {
      if (str.search('Last updated') !== -1) {
        temp = str.split(':');
        lastUpdated = (temp && temp.length)? temp[1].replace(/\s/g, '') : '';
        break;
      }
    }
    return lastUpdated;
  }

  getAddress(addresses: Array<any>, locationType: string) {
    return [ ...Array.from(new Set(
      addresses
        .filter((addr) => !!addr[locationType])
        .map((addr) => addr[locationType])
    ))].join(',');
  }

  getMatchedDob(additionalInfos: any[]) {
    return [ ...Array.from(new Set(
      additionalInfos
        .filter((info) => !!(info['Type'] === 'DOB' && info['Value']))
        .map((info) => info['Value'])
    ))].join(',');
  }
}

const tagsMapperService = new TagsMapperService();
export default tagsMapperService;
