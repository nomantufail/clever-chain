export default interface IFullReport {
  "name": string,
  "matchCriteria": string,
  "occupation": string,
  "matchDescription": string[],
  "scannedDate": string,
  "generalInformation": {
    registeredName?: {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    tradingName?: {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    ein?: {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    "firstName": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    "middleName": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    "lastName": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    "dateOfBirth": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    }
  },
  "addressAndLocation": {
    "currentAddress": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity":string
    },
    "city": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    "country": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    },
    "postalCode": {
      "matchCriteria": string,
      "matchCriteriaNumeric": number,
      "internalInfo": string,
      "matchedEntity": string
    }
  },
  "otherAddresses": string[],
  "findings": [
    {
      "key": string,
      "value": string[]
    },
    {
      "key": string,
      "value": string[]
    },
    {
      "key": string,
      "value": string[]
    },
    {
      "key": string,
      "value": string[]
    },
    {
      "key": string,
      "value": string[]
    }
  ],
  "profileNotes": string,
  "sourceLinks": string[]
}
