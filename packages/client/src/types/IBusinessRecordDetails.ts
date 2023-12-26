export default interface IBusinessRecordDetails {
    registeredName: {
        matchCriteria: string,
        internalInfo: string
        matchedEntity: string
    },
    tradingName: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    ein: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    addressLine1: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    addressLine2: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    city: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    },
    country: {
        matchCriteria: string,
        internalInfo: string,
        matchedEntity: string
    }
}
