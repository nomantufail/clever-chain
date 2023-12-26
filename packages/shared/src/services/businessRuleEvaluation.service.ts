import commonService from "./common.service";
class BusinessRuleEvaluationService {
  constructor() {
  }

  /**
   * business attributes needs to be modified
   */
  evaluateRulesForBusiness = (business: any) => {
    const parsedObject = JSON.parse(business.mapped_entity_details);
    parsedObject.registeredName.matchCriteria = this.getMatchCriteriaForName(
      business.intermediate_entity_record_parsed
    );
    parsedObject.tradingName.matchCriteria = 'Not Available';
    parsedObject.addressLine1.matchCriteria = this.getMatchCriteriaForAddressLine1(
      business.intermediate_entity_record_parsed
    );
    parsedObject.country.matchCriteria = this.getMatchCriteriaForCountry(
      business.intermediate_entity_record_parsed
    );
    parsedObject.city.matchCriteria = this.getMatchCriteriaForCity(
      business.intermediate_entity_record_parsed
    );
    parsedObject.ein.matchCriteria = this.getMatchCriteriaForID(
      business.intermediate_entity_record_parsed
    )
    const { matchProbability, ruleEvalDesc } = this.getMatchCriteriaForParentBusinessMatch(
      business.intermediate_entity_record_parsed
    );
    business.match = matchProbability;
    business.match_description = ruleEvalDesc;
    business.mapped_entity_details = JSON.stringify(parsedObject);

    return business;
  };

  getMatchCriteriaForName(match: any) {
    if (this.isExactName(match)) {
      return "Exact";
    } else if (this.isPartialName(match)) {
      return "Partial";
    } else if (this.isDifferentName(match)) {
      return "Different";
    } else {
      return "Not Available";
    }
  }

  getMatchCriteriaForAKA(match: any) {
    if (this.isExactAKA(match)) {
      return "Exact";
    } else if (this.isPartialAKA(match)) {
      return "Partial";
    } else if (this.isDifferentAKA(match)) {
      return "Different";
    } else {
      return "Not Available";
    }
  }

  getMatchCriteriaForAddressLine1(match: any) {
    if (this.isExactAddress(match)) {
      return "Exact";
    } else if (this.isPartialAddress(match)) {
      return "Partial";
    } else if (this.isDifferentAddress(match)) {
      return "Different";
    } else {
      return "Not Available";
    }
  }

  getMatchCriteriaForPostCode(match: any) {
    if (this.isExactPostCode(match)) {
      return "Exact";
    } else if (this.isPartialPostCode(match)) {
      return "Partial";
    } else if (this.isDifferentPostCode(match)) {
      return "Different";
    } else {
      return "Not Available";
    }
  }

  getMatchCriteriaForCountry(match: any) {
    if (this.isExactCountry(match)) {
      return "Exact";
    } else if (this.isDifferentCountry(match)) {
      return "Different";
    } else if (this.isPartialCountry(match)) {
      return "Partial";
    } else {
      return "Not Available";
    }
  }

  getMatchCriteriaForCity(match: any) {
    if (this.isExactCity(match)) {
      return "Exact";
    } else if (this.isDifferentCity(match)) {
      return "Different";
    } else if (this.isPartialCity(match)) {
      return "Partial";
    } else {
      return "Not Available";
    }
  }

  getMatchCriteriaForID(match: any) {
    if (this.isExactID(match)) {
      return "Exact";
    } else if (this.isPartialID(match)) {
      return "Partial";
    } else if (this.isNotAvailableID(match)) {
      return "Not Available";
    } else {
      return "Different";
    }
  }

  getMatchCriteriaForEntityType(match: any) {
    if (this.isExactEntityType(match)) {
      return "Exact";
    } else if (this.isDifferentEntityType(match)) {
      return "Different";
    } else if (this.isPartialEntityType(match)) {
      return "Partial";
    } else {
      return "Not Available";
    }
  }

  getMatchCriteriaForParentBusinessMatch(match: any) {
    let ruleEvalDesc, matchProbability;

    if (this.isExact(match)) {
      matchProbability = "Exact";
      ruleEvalDesc = "Name + Exact address or Registration number";
    } else if (this.isVeryHigh(match)) {
      matchProbability = "Very High";
      ruleEvalDesc = "Name  + Exact Address";
    } else if (this.isHigh(match)) {
      matchProbability = "High";
      ruleEvalDesc = "Name + Location";
    } else if (this.isMedium(match)) {
      matchProbability = "Medium";
      ruleEvalDesc = "Name + Location (Partial)";
    } else if (this.isLow(match)) {
      matchProbability = "Low";
      ruleEvalDesc = "Partial name + Country";
    } else if (this.isVeryLow(match)) {
      matchProbability = "Very Low";
      ruleEvalDesc = "Weak name match OR location mismatch";
    }
    return { matchProbability, ruleEvalDesc };
  }

  isExact(match: any) {
    // bestnamescore=100 AND (Exact Address OR Exact ID) AND Conflicts/EntityTypeConflict = FALSE
    if (match["Conflicts"]) {
      return (
        match["BestNameScore"] === 100 &&
        (this.isExactAddress(match) || this.isExactID(match)) &&
        !match["Conflicts"]["EntityTypeConflict"]
      );
    }
    return false;
  }

  isVeryHigh(match: any) {
    // bestnamescore=100 AND Exact address) AND Conflicts/EntityTypeConflict = TRUE
    if (match["Conflicts"]) {
      return !!(
        match["BestNameScore"] === 100 &&
        this.isExactAddress(match) &&
        match["Conflicts"]["EntityTypeConflict"]
      );
    }
    return false;
  }

  isHigh(match: any) {
    /* bestnamescore=100 AND( Partial or Exact Post Code)
     95<bestnamescore<100 AND (Exact Address OR Exact ID) */
    return !!(
      (match["BestNameScore"] === 100 &&
        (this.isExactPostCode(match) || this.isPartialPostCode(match))) ||
      (match["BestNameScore"] > 95 &&
        match["BestNameScore"] < 100 &&
        (this.isExactAddress(match) || this.isExactID(match)))
    );
  }

  isMedium(match: any) {
    /* bestnamescore=100 AND exact country
       95<bestnamescore<100 AND Exact address AND Conflicts/EntityTypeConflict = TRUE*/
    return !!(
      (match["BestNameScore"] === 100 && this.isExactCountry(match)) ||
      (match["BestNameScore"] > 95 &&
        match["BestNameScore"] < 100 &&
        this.isExactAddress(match) &&
        match["Conflicts"] && match["Conflicts"]["EntityTypeConflict"] === true)
    );
    return false;
  }

  isLow(match: any) {
    // 95<bestnamescore<99 AND exact country
    return !!(
      match["BestNameScore"] > 95 &&
      match["BestNameScore"] < 99 &&
      this.isExactCountry(match)
    );
  }

  // @ts-ignore
  isVeryLow(match: any) {
    // All other matches
    return true;
  }

  /*****************************
   * Detail level rule evaluation
   *****************************/

  isExactName(match: any) {
    // Best name score = 100
    if (match["BestNameScore"] === 100) {
      return true;
    }
    return false;
  }

  isPartialName(match: any) {
    // Best name score <>100
    if (match["BestNameScore"] && match["BestNameScore"] > 0 && match["BestNameScore"] !== 100) {
      return true;
    }
    return false;
  }

  isDifferentName(match: any) {
    if (!this.isExactName(match) && !this.isPartialName(match)) {
      return true;
    }
    return false;
  }

  isNotAvailableName(match: any) {
    if (!match["BestNameScore"]) {
      return true;
    }
    return false;
  }

  isExactAKA(match: any) {
    // InputDetails/Name/Full=EntityDetails/AKAs/0/Name/Full
    if (
      match["EntityDetails"] &&
      match["EntityDetails"]["AKAs"] &&
      match["InputDetails"] &&
      match["InputDetails"]["Name"]
    ) {
      return match["EntityDetails"]["AKAs"].some((aka: any) => {
        if (aka["Name"] && aka["Name"]["Full"]) {
          return aka["Name"]["Full"].toLowerCase() === match["InputDetails"]["Name"]["Full"].toLowerCase();
        }
      });
    }
    return false;
  }

  isPartialAKA(match: any) {
    if (!this.isExactAKA(match)) {
      return true;
    }
    return false;
  }

  isDifferentAKA(match: any) {
    if (!this.isExactAKA(match) && !this.isPartialAKA(match)) {
      return true;
    }
    return false;
  }

  isNotAvailableAKA(match: any) {
    if (!this.isExactAKA(match) && !this.isPartialAKA(match) && !this.isDifferentAKA(match)) {
      return true;
    }
    return false;
  }

  isExactAddress(match: any) {
    // (Addresses/0/ListValue <> blank AND InputDetails/Addresses/0/Street1 <>blank)
    return (
      commonService._getAllAddresses(match).some((address: any) => address["ListValue"]) &&
      match["InputDetails"]["Addresses"].some((address: any) => !!address["Street1"])
    );
  }

  isPartialAddress(match: any) {
    // (Addresses/0/ListValue <> blank AND InputDetails/Addresses/0/Street1 is blank)
    return (
      commonService._getAllAddresses(match).some((address: any) => address["ListValue"])
      && !match["InputDetails"]["Addresses"].some((address: any) => !!address["Street1"])
    );
  }

  isDifferentAddress(match: any) {
    if (!this.isExactAddress(match) && !this.isPartialAddress(match)) {
      return true;
    }
    return false;
  }

  isNotAvailableAddress(match: any) {
    // InputDetails/Addresses/0/Street1 =blank
    return !match["InputDetails"]["Addresses"].some((address: any) => !!address["Street1"]);
  }

  isExactPostCode(match: any) {
    // InputDetails/Addresses/0/PostalCode=EntityDetails/Addresses/1/PostalCode
    if (
      !(match["InputDetails"] && Array.isArray(match["InputDetails"]["Addresses"]))
    ) {
      return false;
    }
    const inputPostalCodes = match["InputDetails"]["Addresses"].filter(
      (addr: any) => !!addr["PostalCode"]
    );
    const outputPostalCodes = commonService._getAllAddresses(match).filter(
      (addr) => !!addr["PostalCode"]
    );
    if (inputPostalCodes.length && outputPostalCodes.length) {
      return inputPostalCodes.some((inputCode: any) => {
        return outputPostalCodes.some(
          (outputCode) => outputCode["PostalCode"] === inputCode["PostalCode"]
        );
      });
    }
    return false;
  }

  isPartialPostCode(match: any) {
    //  First 3 chars of InputDetails/Addresses/0/PostalCode = first three chars of EntityDetails/Addresses/1/PostalCode AND InputDetails/Addresses/0/PostalCode<>EntityDetails/Addresses/1/PostalCode
    if (
      !(
        match["InputDetails"] &&
        Array.isArray(match["InputDetails"]["Addresses"])
      )
    ) {
      return false;
    }

    const inputPostalCodes = match["InputDetails"]["Addresses"].filter(
      (addr) => !!addr["PostalCode"]
    );
    const outputPostalCodes = commonService._getAllAddresses(match).filter(
      (addr) => !!addr["PostalCode"]
    );
    if (inputPostalCodes.length && outputPostalCodes.length) {
      return (
        inputPostalCodes.some((inputCode) => {
          return outputPostalCodes.some(
            (outputCode) =>
              outputCode["PostalCode"].substring(0, 3) === inputCode["PostalCode"].substring(0, 3)
          );
        }) && !this.isExactPostCode(match)
      );
    }

    return false;
  }

  isNotAvailablePostCode(match: any) {
    // InputDetails/Addresses/0/PostalCode
    if (
      !(
        match["InputDetails"] &&
        match["InputDetails"]["Addresses"] &&
        Array.isArray(match["InputDetails"]["Addresses"])
      )
    ) {
      return true;
    }
    const inputPostalCodes = match["InputDetails"]["Addresses"].filter(
      (addr) => !!addr["PostalCode"]
    );
    return !inputPostalCodes.some((addr) => addr["PostalCode"]);
  }

  isDifferentPostCode(match: any) {
    return (
      !this.isPartialPostCode(match) &&
      !this.isExactPostCode(match) &&
      !this.isNotAvailablePostCode(match)
    );
  }

  isExactCity(match: any) {
    // InputDetails/Addresses/1/City=EntityDetails/Addresses/2/City and is not blank
    if (
      !(
        match["InputDetails"] &&
        Array.isArray(match["InputDetails"]["Addresses"])
      )
    ) {
      return false;
    }
    const inputCities = match["InputDetails"]["Addresses"].filter((addr) => !!addr["City"]);
    const outputCities = commonService._getAllAddresses(match).filter((addr) => !!addr["City"]);
    if (inputCities.length && outputCities.length) {
      return inputCities.some((inputCity) => {
        return outputCities.some((outCity) => outCity["City"].toLowerCase() === inputCity["City"].toLowerCase());
      });
    }
    return false;
  }

  isPartialCity(match: any) {
    return !this.isExactCity(match) && !this.isNotAvailableCity(match);
  }

  isDifferentCity(match: any) {
    return this.isPartialCity(match);
  }

  isNotAvailableCity(match: any) {
    // InputDetails/Addresses/1/City
    const outputCities = commonService._getAllAddresses(match).filter((addr) => !!addr["City"]);
    if (outputCities.length) {
      return !outputCities.some((outputCity) => !!outputCity["City"]);
    }
    return true;
  }

  isExactCountry(match: any) {
    // InputDetails/Addresses/0/Country=EntityDetails/Addresses/0/Country AND not blank
    if (
      !(
        match["InputDetails"] &&
        Array.isArray(match["InputDetails"]["Addresses"])
      )
    ) {
      return false;
    }
    const inputCities = match["InputDetails"]["Addresses"].filter((addr) => !!addr["Country"]);
    const outputCities = commonService._getAllAddresses(match).filter((addr) => !!addr["Country"]);
    if (inputCities.length && outputCities.length) {
      return inputCities.some((inputCity) => {
        return outputCities.some((outCity) => outCity["Country"].toLowerCase() === inputCity["Country"].toLowerCase());
      });
    }
    return false;
  }

  isPartialCountry(match: any) {
    return !this.isExactCountry(match) && !this.isNotAvailableCountry(match);
  }

  isDifferentCountry(match: any) {
    return this.isPartialCountry(match);
  }

  isNotAvailableCountry(match: any) {
    const outputCountries = commonService._getAllAddresses(match).filter((addr) => !!addr["Country"]);
    return !outputCountries.length;
  }

  isExactID(match: any) {
    // Input ID = Match Entity ID (and permutations with other ID) AND not blank
    if (match["InputDetails"] && Array.isArray(match["InputDetails"]["IDs"]) &&
        match["EntityDetails"] && Array.isArray(match["EntityDetails"]["IDs"])) {
      const inputId = match["InputDetails"]["IDs"].find((info) => info.Type === "EIN");
      const outIds = match["EntityDetails"]["IDs"];
      if (inputId && outIds.length) {
        return (
          outIds.some((outputId) => outputId["Number"] === inputId["Number"])
          || outIds.some((outputId) => outputId["Number"].replace(/-/g, '') === inputId["Number"].replace(/-/g, ''))
        )
      }
    }
    return false;
  }

  // @ts-ignore
  isPartialID(match: any) {
    return false;
  }

  // @ts-ignore
  isDifferentID(match: any) {
    return false;
  }

  isNotAvailableID(match: any) {
    // InputDetails/IDs/0/Number=blank OR EntityDetails/IDs/0/Number = blank
    return (
      !(
        match["InputDetails"]
        && Array.isArray(match["InputDetails"]["IDs"])
        && match["InputDetails"]["IDs"].some((id: any) => !!id["Number"])
      )
      ||
      !(
        match["EntityDetails"]
        && Array.isArray(match["EntityDetails"]["IDs"])
        && match["EntityDetails"]["IDs"].some((id: any) => !!id["Number"])
      )
    );
  }

  isExactEntityType(match: any) {
    // InputDetails/EntityType=EntityDetails/EntityType
    if (
      match["EntityDetails"] &&
      match["EntityDetails"]["EntityType"] &&
      match["InputDetails"] &&
      match["InputDetails"]["EntityType"]
    ) {
      return match["InputDetails"]["EntityType"] === match["EntityDetails"]["EntityType"];
    }
    return false;
  }

  isPartialEntityType(match: any) {
    return !this.isExactEntityType(match) && !this.isNotAvailableEntityType(match);
  }

  isDifferentEntityType(match: any) {
    return this.isPartialEntityType(match);
  }

  isNotAvailableEntityType(match: any) {
    return !(
      match["EntityDetails"] &&
      match["EntityDetails"]["EntityType"] &&
      match["InputDetails"] &&
      match["InputDetails"]["EntityType"]
    );
  }
}

const businessRuleEvaluationService = new BusinessRuleEvaluationService();
export default businessRuleEvaluationService;
