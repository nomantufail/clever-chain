export default interface IIndividualRecordDetails {
    firstName: {
        matchCriteria: string,
        internalInfo: string
        matchedEntity: string
    },
    middleName: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    lastName: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    dateOfBirth: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    addressLine1: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string

    },
    city: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    }
    country: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    }
}
