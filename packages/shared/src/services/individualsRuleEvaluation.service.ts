import commonService from './common.service';
import { DateFormat } from '../enums';

class IndividualRuleEvaluationService {
  constructor() {}

  evaluateRulesForIndividual = (individual: any) => {
    const parsedObject = JSON.parse(individual.mapped_entity_details);
    parsedObject.firstName.matchCriteria = this.getMatchCriteriaForFirstName(
      individual.intermediate_entity_record_parsed,
    );
    parsedObject.middleName.matchCriteria = this.getMatchCriteriaForMiddleName(
      individual.intermediate_entity_record_parsed,
    );
    parsedObject.lastName.matchCriteria = this.getMatchCriteriaForLastName(
      individual.intermediate_entity_record_parsed,
    );
    parsedObject.dateOfBirth.matchCriteria = this.getMatchCriteriaForDateOfBirth(
      individual.intermediate_entity_record_parsed,
    );
    parsedObject.addressLine1.matchCriteria = this.getMatchCriteriaForAddressLine1(
      individual.intermediate_entity_record_parsed,
    );
    parsedObject.country.matchCriteria = this.getMatchCriteriaForCountry(
      individual.intermediate_entity_record_parsed,
    );
    parsedObject.city.matchCriteria = this.getMatchCriteriaForCity(
      individual.intermediate_entity_record_parsed,
    );
    parsedObject.id.matchCriteria = this.getMatchCriteriaForID(
      individual.intermediate_entity_record_parsed,
    );
    const { matchProbability, ruleEvalDesc } = this.getMatchCriteriaForParentIndividualMatch(
      individual.intermediate_entity_record_parsed,
    );
    individual.match = matchProbability;
    individual.match_description = ruleEvalDesc;
    individual.mapped_entity_details = JSON.stringify(parsedObject);

    return individual;
  };

  getMatchCriteriaForFirstName(match: any) {
    if (this.isExactFirstName(match)) {
      return 'Exact';
    } else if (this.isPartialFirstName(match)) {
      return 'Partial';
    } else if (this.isDifferentFirstName(match)) {
      return 'Different';
    } else {
      return 'Not Available';
    }
  }

  getMatchCriteriaForLastName(match: any) {
    if (this.isExactLastName(match)) {
      return 'Exact';
    } else if (this.isPartialLastName(match)) {
      return 'Partial';
    } else if (this.isDifferentLastName(match)) {
      return 'Different';
    } else {
      return 'Not Available';
    }
  }

  getMatchCriteriaForMiddleName(match: any) {
    if (this.isExactMiddleName(match)) {
      return 'Exact';
    } else if (this.isPartialMiddleName(match)) {
      return 'Partial';
    } else if (this.isDifferentMiddleName(match)) {
      return 'Different';
    } else {
      return 'Not Available';
    }
  }

  getMatchCriteriaForDateOfBirth(match: any) {
    if (this.isExactDOB(match)) {
      return 'Exact';
    } else if (this.isPartialDOB(match)) {
      return 'Partial';
    } else if (this.isDifferentDOB(match)) {
      return 'Different';
    } else {
      return 'Not Available';
    }
  }

  getMatchCriteriaForAddressLine1(match: any) {
    if (this.isExactAddress(match)) {
      return 'Exact';
    } else if (this.isPartialAddress(match)) {
      return 'Partial';
    } else if (this.isDifferentAddress(match)) {
      return 'Different';
    } else {
      return 'Not Available';
    }
  }

  getMatchCriteriaForCountry(match: any) {
    if (this.isExactCountry(match)) {
      return 'Exact';
    } else if (this.isDifferentCountry(match)) {
      return 'Different';
    } else if (this.isPartialCountry(match)) {
      return 'Partial';
    } else {
      return 'Not Available';
    }
  }

  getMatchCriteriaForCity(match: any) {
    if (this.isExactCity(match)) {
      return 'Exact';
    } else if (this.isDifferentCity(match)) {
      return 'Different';
    } else if (this.isPartialCity(match)) {
      return 'Partial';
    } else {
      return 'Not Available';
    }
  }

  getMatchCriteriaForID(match: any) {
    if (this.isExactID(match)) {
      return 'Exact';
    } else if (this.isDifferentID(match)) {
      return 'Different';
    } else if (this.isPartialID(match)) {
      return 'Partial';
    } else if (this.isNotAvailableID(match)) {
      return 'Not Available';
    }
  }

  getMatchCriteriaForGender(match: any) {
    if (this.isExactGender(match)) {
      return 'Exact';
    } else if (this.isDifferentGender(match)) {
      return 'Different';
    } else if (this.isPartialGender(match)) {
      return 'Partial';
    } else if (this.isNotAvailableGender(match)) {
      return 'Not Available';
    }
  }

  getMatchCriteriaForParentIndividualMatch(match: any) {
    let ruleEvalDesc, matchProbability;

    if (this.isExact(match)) {
      matchProbability = 'Exact';
      ruleEvalDesc = 'Name + Exact Date Of Birth  + Exact address';
    } else if (this.isVeryHigh(match)) {
      matchProbability = 'Very High';
      ruleEvalDesc = 'Name  + Exact Date Of Birth OR Exact Address';
    } else if (this.isHigh(match)) {
      matchProbability = 'High';
      ruleEvalDesc = 'Name  + date of birth within 1 year and same city or ID';
    } else if (this.isMedium(match)) {
      matchProbability = 'Medium';
      ruleEvalDesc = 'Partial Name  + date of birth within 1 year and same city';
    } else if (this.isLow(match)) {
      matchProbability = "Low";
      ruleEvalDesc = "Date of birth within 2 years and same country but not clear city connection or country mismatch";
    } else if (this.isVeryLow(match)) {
      matchProbability = 'Very Low';
      ruleEvalDesc = 'Weak name match OR country mismatch OR Gender mismatch';
    }
    return { matchProbability, ruleEvalDesc };
  }

  isExact(match: any) {
    // bestnamescore>80 AND Exact Date of Birth (DDMMYYYY) AND Exact Address OR Exact ID
    return !!(
      (match['BestNameScore'] > 80 && this.isExactDOB(match) && this.isExactAddress(match)) ||
      this.isExactID(match)
    );
  }

  isVeryHigh(match: any) {
    // bestnamescore>80 AND (Exact DOB OR Exact address) AND Exact EntityType And Exact Country OR
    // bestnamescore>95 AND (Input Date of birth MMYYYY = Matched Date of birth MMYYYY AND (Matched Date of birth DD=00 OR XX OR blank)
    return !!(
      (match['BestNameScore'] > 80 &&
        (this.isExactDOB(match) || this.isExactAddress(match)) &&
        this.isExactEntityType(match) &&
        this.isExactCountry(match)) ||
      (match['BestNameScore'] > 95 &&
        this.isDOBMMYYYYMatched(match) &&
        this.isOutDobDayUnavailable(match))
    );
  }

  // check for output dob day unavailable
  isOutDobDayUnavailable(match: any) {
    return this.isOutDobMonthUnavailable(match);
  }

  // check for output dob unavailable
  isOutDobMonthUnavailable(match: any) {
    if (
      match['EntityDetails'] &&
      match['EntityDetails']['AdditionalInfo'] &&
      Array.isArray(match['EntityDetails']['AdditionalInfo'])
    ) {
      const outDobs = match['EntityDetails']['AdditionalInfo'].filter(
        (info) => info.Type === 'DOB',
      );
      if (outDobs.length) {
        return !outDobs.some((outputDob) => {
          return (
            outputDob['Value'] && commonService.isValidDate(outputDob['Value'], DateFormat.Output)
          );
        });
      }
    }
    return false;
  }

  // compare dob month and year
  isDOBMMYYYYMatched(match: any) {
    if (
      match['InputDetails'] &&
      Array.isArray(match['InputDetails']['AdditionalInfo']) &&
      match['EntityDetails'] &&
      Array.isArray(match['EntityDetails']['AdditionalInfo'])
    ) {
      const inputDobs = match['InputDetails']['AdditionalInfo'].filter(
        (info) => info.Type === 'DOB',
      );
      const outDobs = match['EntityDetails']['AdditionalInfo'].filter(
        (info) => info.Type === 'DOB',
      );
      if (inputDobs.length && outDobs.length) {
        return inputDobs.some((inputDob) => {
          return outDobs.some((outputDob) => {
            return (
              !!outputDob['Value'] &&
              !!inputDob['Value'] &&
              commonService.isValidDate(outputDob['Value'], DateFormat.Output) &&
              commonService.getYear(outputDob['Value'], DateFormat.Output) ===
                commonService.getYear(inputDob['Value'], DateFormat.Input) &&
              commonService.getMonth(outputDob['Value'], DateFormat.Output) ===
                commonService.getMonth(inputDob['Value'], DateFormat.Input)
            );
          });
        });
      }
    }
    return false;
  }

  isHigh(match: any) {
    // bestnamescore>95 AND exact country AND (Entity Match Date of birth MM=00 or blank AND Internal Date Of Birth YYYY= Matched Entity Date Of Birth YYYY AND (Exact City OR Partial PostCode OR Exact ID)
    return !!(
      match['BestNameScore'] > 95 &&
      this.isExactCountry(match) &&
      this.isOutDobMonthUnavailable(match) &&
      this.isPartialDOB(match) &&
      (this.isExactCity(match) || this.isPartialPostCode(match) || this.isExactID(match))
    );
  }

  isMedium(match: any) {
    // [bestnamescore<=95 AND (Entity Match Date of birth MM=00 or blank AND (Exact City OR Partial PostCode)]
    return !!(
      match['BestNameScore'] <= 95 &&
      this.isOutDobMonthUnavailable(match) &&
      (this.isExactCity(match) || this.isPartialPostCode(match))
    );
  }

  isLow(match: any) {
    // bestnamescore>80 AND Partial DOB AND No City Exact AND No PostCode Partial
    return !!(
      match['BestNameScore'] > 80 &&
      this.isPartialDOB(match) &&
      !this.isExactCity(match) &&
      !this.isPartialPostCode(match) &&
      !this.isExactPostCode(match)
    );
  }

  // @ts-ignore
  isVeryLow(match: any) {
    return true;
  }

  // converts data format from yyyy/mm/dd to dd/mm/yyyy
  reverseOutputDate(input: any) {
    var pattern = /(\S{4})\/(\S{2})\/(\S{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$3/$2/$1');
  }

  /*****************************
   * Detail level rule evaluation
   *****************************/

  isExactFirstName(match: any) {
    // InputDetails/Name/First=EntityDetails/Name/First
    const bridgerFirstName = commonService.getNamePart(match['BestName'], 'first');
    if (bridgerFirstName) {
      return match['InputDetails']['Name']['First'] === bridgerFirstName;
    }
    return false;
  }

  isPartialFirstName(match: any) {
    // InputDetails/Name/First<>EntityDetails/Name/First AND bestnamescore>95
    const bridgerFirstName = commonService.getNamePart(match['BestName'], 'first');
    if (bridgerFirstName) {
      return (
        match['InputDetails']['Name']['First'] !== bridgerFirstName && match['BestNameScore'] > 95
      );
    }
    return false;
  }

  isDifferentFirstName(match: any) {
    return (
      !this.isPartialFirstName(match) &&
      !this.isExactFirstName(match) &&
      !this.isNotAvailableFirstName(match)
    );
  }

  isNotAvailableFirstName(match: any) {
    return !commonService.getNamePart(match['BestName'], 'first');
  }

  isExactMiddleName(match: any) {
    // InputDetails/Name/Middle=EntityDetails/Name/Middle
    const bridgerMiddleName = commonService.getNamePart(match['BestName'], 'middle');
    if (bridgerMiddleName) {
      return match['InputDetails']['Name']['Middle'] === bridgerMiddleName;
    }
    return false;
  }

  isPartialMiddleName(match: any) {
    //   InputDetails/Name/Middle=First Char of EntityDetails/Name/Middle AND EntityDetails/Name/Middle >1 char  (i.e. J vs James)
    // First Char of InputDetails/Name/Middle=EntityDetails/Name/Middle AND InputDetails/Name/Middle>1char (i.e. James vs J)

    const bridgerMiddleName = commonService.getNamePart(match['BestName'], 'middle');
    if (
      bridgerMiddleName &&
      match['InputDetails'] &&
      match['InputDetails']['Name'] &&
      match['InputDetails']['Name']['Middle']
    ) {
      return (
        (match['InputDetails']['Name']['Middle'] === bridgerMiddleName[0] &&
          bridgerMiddleName.length > 1) ||
        (match['InputDetails']['Name']['Middle'][0] === bridgerMiddleName &&
          match['InputDetails']['Name']['Middle'].length > 1)
      );
    }
    return false;
  }

  isNotAvailableMiddleName(match: any) {
    const bridgerMiddleName = commonService.getNamePart(match['BestName'], 'middle');
    return !bridgerMiddleName;
  }

  isDifferentMiddleName(match: any) {
    return (
      !this.isPartialMiddleName(match) &&
      !this.isExactMiddleName(match) &&
      !this.isNotAvailableMiddleName(match)
    );
  }

  isExactLastName(match: any) {
    // InputDetails/Name/Last=EntityDetails/Name/Last
    const bridgerLastName = commonService.getNamePart(match['BestName'], 'last');
    if (bridgerLastName) {
      return match['InputDetails']['Name']['Last'] === bridgerLastName;
    }
    return false;
  }

  isPartialLastName(match: any) {
    // InputDetails/Name/First<>EntityDetails/Name/First AND bestnamescore>95
    const bridgerLastName = commonService.getNamePart(match['BestName'], 'last');
    if (bridgerLastName) {
      return (
        match['InputDetails']['Name']['Last'] !== bridgerLastName && match['BestNameScore'] > 95
      );
    }
    return false;
  }

  isDifferentLastName(match: any) {
    return (
      !this.isPartialFirstName(match) &&
      !this.isExactFirstName(match) &&
      !this.isNotAvailableFirstName(match)
    );
  }

  isNotAvailableLastName(match: any) {
    const bridgerLastName = commonService.getNamePart(match['BestName'], 'last');
    return !bridgerLastName;
  }

  isExactAKA(match: any) {
    // InputDetails/Name/Full=EntityDetails/AKAs/0/Name/Full
    if (
      match['InputDetails']['Name']['Full'] === match['EntityDetails']['AKAs'][0]['Name']['Full']
    ) {
      return true;
    }
    return false;
  }

  isPartialAKA(match: any) {
    return !!match['EntityDetails']['AKAs'].find((aka: any) => !!aka['Name']['Full']);
  }

  //@ts-ignore
  isNotAvailableAKA(match: any) {
    return true;
  }

  /* exact match dob by considering input dob format would always be DD/MM/YYYY
     also as per current observation output dob format is YYYY/MM/DD
   */
  isExactDOB(match: any) {
    // Internal Date of birth DDMMYYY= Matched Entity Date of Birth DDMMYYYY
    if (
      match['InputDetails'] &&
      Array.isArray(match['InputDetails']['AdditionalInfo']) &&
      match['EntityDetails'] &&
      Array.isArray(match['EntityDetails']['AdditionalInfo'])
    ) {
      const inputDobs = match['InputDetails']['AdditionalInfo'].filter(
        (info) => info.Type === 'DOB',
      );
      const outDobs = match['EntityDetails']['AdditionalInfo'].filter(
        (info) => info.Type === 'DOB',
      );
      if (inputDobs.length && outDobs.length) {
        return inputDobs.some((inputDob) => {
          return outDobs.some((outputDob) => {
            const formattedOutDate = commonService.formatDate(outputDob['Value'], DateFormat.Output, DateFormat.Input);
            return (
              outputDob['Value'] &&
              inputDob['Value'] &&
              (formattedOutDate === inputDob['Value'] && outputDob['Value'].length === inputDob['Value'].length)
            );
          });
        });
      }
    }
    return false;
  }

  isPartialDOB(match: any) {
    /* Internal Date of birth(InputDetails/AdditionalInfo/0/Value) DDMMYYY<> Matched Entity Date of Birth DDMMYYYY AND
     Internal Date of Birth YYYY = Entity match Date of Birth YYYY AND not blank (please note some matches have more than 1 entity match year) */
    if (
      match['InputDetails'] &&
      Array.isArray(match['InputDetails']['AdditionalInfo']) &&
      match['EntityDetails'] &&
      Array.isArray(match['EntityDetails']['AdditionalInfo'])
    ) {
      const inputDobs = match['InputDetails']['AdditionalInfo'].filter(
        (info) => info.Type === 'DOB',
      );
      const outDobs = match['EntityDetails']['AdditionalInfo'].filter(
        (info) => info.Type === 'DOB',
      );
      if (inputDobs.length && outDobs.length) {
        return inputDobs.some((inputDob) => {
          return outDobs.some((outputDob) => {
            return (
              outputDob['Value'] &&
              inputDob['Value'] &&
              commonService.getYear(outputDob['Value'], DateFormat.Output) ===
                commonService.getYear(inputDob['Value'], DateFormat.Input)
            );
          });
        });
      }
    }
    return false;
  }

  isNotAvailableDOB(match: any) {
    //   InputDetails/AdditionalInfo/0/Value is blank OR
    // EntityDetails/AdditionalInfo/0/Value is blank
    if (
      !(
        match['InputDetails'] &&
        Array.isArray(match['InputDetails']['AdditionalInfo']) &&
        match['EntityDetails'] &&
        Array.isArray(match['EntityDetails']['AdditionalInfo'])
      )
    ) {
      return true;
    }
    const inputDobs = match['InputDetails']['AdditionalInfo'].filter((info) => info.Type === 'DOB');
    const outDobs = match['EntityDetails']['AdditionalInfo'].filter((info) => info.Type === 'DOB');
    return !inputDobs.some((dob) => dob['Value']) || !outDobs.some((dob) => dob['Value']);
  }

  isDifferentDOB(match: any) {
    return !this.isPartialDOB(match) && !this.isExactDOB(match) && !this.isNotAvailableDOB(match);
  }

  isExactAddress(match: any) {
    // (Addresses/0/ListValue <> blank AND InputDetails/Addresses/0/Street1 <>blank)
    if (!(match['InputDetails'] && Array.isArray(match['InputDetails']['Addresses']))) {
      return false;
    }
    return (
      commonService._getAllAddresses(match).some((address: any) => !!address['ListValue']) &&
      match['InputDetails']['Addresses'].some((address) => !!address['Street1'])
    );
  }

  isPartialAddress(match: any) {
    // (Addresses/0/ListValue <> blank AND InputDetails/Addresses/0/Street1 is blank)
    if (!(match['InputDetails'] && Array.isArray(match['InputDetails']['Addresses']))) {
      return false;
    }
    return (
      commonService._getAllAddresses(match).some((address) => !!address['ListValue']) &&
      !match['InputDetails']['Addresses'].some((address) => !!address['Street1'])
    );
  }

  isNotAvailableAddress(match: any) {
    // InputDetails/Addresses/0/Street1 =blank
    if (
      !(
        match['InputDetails'] &&
        match['InputDetails']['Addresses'] &&
        Array.isArray(match['InputDetails']['Addresses'])
      )
    ) {
      return true;
    }
    return !match['InputDetails']['Addresses'].some((address) => !!address['Street1']);
  }

  isDifferentAddress(match: any) {
    return (
      !this.isPartialAddress(match) &&
      !this.isExactAddress(match) &&
      !this.isNotAvailableAddress(match)
    );
  }

  isExactPostCode(match: any) {
    // InputDetails/Addresses/0/PostalCode=EntityDetails/Addresses/1/PostalCode
    if (!(match['InputDetails'] && Array.isArray(match['InputDetails']['Addresses']))) {
      return false;
    }
    const inputPostalCodes = match['InputDetails']['Addresses'].filter(
      (addr) => !!addr['PostalCode'],
    );
    const outputPostalCodes = commonService
      ._getAllAddresses(match)
      .filter((addr) => !!addr['PostalCode']);
    if (inputPostalCodes.length && outputPostalCodes.length) {
      return inputPostalCodes.some((inputCode) => {
        return outputPostalCodes.some(
          (outputCode) => outputCode['PostalCode'] === inputCode['PostalCode'],
        );
      });
    }
    return false;
  }

  isPartialPostCode(match: any) {
    //  First 3 chars of InputDetails/Addresses/0/PostalCode = first three chars of EntityDetails/Addresses/1/PostalCode AND InputDetails/Addresses/0/PostalCode<>EntityDetails/Addresses/1/PostalCode
    if (!(match['InputDetails'] && Array.isArray(match['InputDetails']['Addresses']))) {
      return false;
    }

    const inputPostalCodes = match['InputDetails']['Addresses'].filter(
      (addr) => !!addr['PostalCode'],
    );
    const outputPostalCodes = commonService
      ._getAllAddresses(match)
      .filter((addr) => !!addr['PostalCode']);
    if (inputPostalCodes.length && outputPostalCodes.length) {
      return (
        inputPostalCodes.some((inputCode) => {
          return outputPostalCodes.some(
            (outputCode) =>
              outputCode['PostalCode'].substring(0, 3) === inputCode['PostalCode'].substring(0, 3),
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
        match['InputDetails'] &&
        match['InputDetails']['Addresses'] &&
        Array.isArray(match['InputDetails']['Addresses'])
      )
    ) {
      return true;
    }
    const inputPostalCodes = match['InputDetails']['Addresses'].filter(
      (addr) => !!addr['PostalCode'],
    );
    return !inputPostalCodes.some((addr) => addr['PostalCode']);
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
    if (!(match['InputDetails'] && Array.isArray(match['InputDetails']['Addresses']))) {
      return false;
    }
    const inputCities = match['InputDetails']['Addresses'].filter((addr) => !!addr['City']);
    const outputCities = commonService._getAllAddresses(match).filter((addr) => !!addr['City']);
    if (inputCities.length && outputCities.length) {
      return inputCities.some((inputCity) => {
        return outputCities.some(
          (outCity) => outCity['City'].toLowerCase() === inputCity['City'].toLowerCase(),
        );
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
    if (!commonService._getAllAddresses(match).length) {
      return true;
    }
    const outputCities = commonService._getAllAddresses(match).filter((addr) => !!addr['City']);
    if (outputCities.length) {
      return !outputCities.some((outputCity) => !!outputCity['City']);
    }
    return true;
  }

  isExactCountry(match: any) {
    // InputDetails/Addresses/0/Country=EntityDetails/Addresses/0/Country AND not blank
    if (!(match['InputDetails'] && Array.isArray(match['InputDetails']['Addresses']))) {
      return false;
    }
    const inputCities = match['InputDetails']['Addresses'].filter((addr) => !!addr['Country']);
    const outputCities = commonService._getAllAddresses(match).filter((addr) => !!addr['Country']);
    if (inputCities.length && outputCities.length) {
      return inputCities.some((inputCity) => {
        return outputCities.some(
          (outCity) => outCity['Country'].toLowerCase() === inputCity['Country'].toLowerCase(),
        );
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
    if (!commonService._getAllAddresses(match).length) {
      return true;
    }
    const outputCountries = commonService
      ._getAllAddresses(match)
      .filter((addr) => !!addr['Country']);
    return !outputCountries.length;
  }

  isExactID(match: any) {
    // Input ID = Match Entity ID (and permutations with other ID) AND not blank
    if (
      match['InputDetails'] &&
      Array.isArray(match['InputDetails']['IDs']) &&
      match['EntityDetails'] &&
      Array.isArray(match['EntityDetails']['IDs'])
    ) {
      const inputId = match['InputDetails']['IDs'].find((info) => info.Type === 'Other'); // to be verified in screening results
      const outIds = match['EntityDetails']['IDs'];
      if (inputId && outIds.length) {
        return outIds.some((outputId) => outputId['Number'] === inputId['Number']);
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
    // 'Input ID = blank OR EntityDetails/IDs/0/Number = blank
    if (
      !(
        match['InputDetails'] &&
        Array.isArray(match['InputDetails']['IDs']) &&
        match['InputDetails']['IDs'].some((id) => !!id['Number'])
      ) ||
      !(
        match['EntityDetails'] &&
        match['EntityDetails']['IDs'] &&
        match['EntityDetails']['IDs'].some((id: any) => !!id['Number'])
      )
    ) {
      return true;
    }
    return false;
  }

  isExactGender(match: any) {
    // MatchXML/Gender/Input=MatchXML/Gender/List AND not blank
    if (
      match['EntityDetails'] &&
      match['EntityDetails']['Gender'] &&
      match['InputDetails'] &&
      match['InputDetails']['Gender']
    ) {
      return match['InputDetails']['Gender'] === match['EntityDetails']['Gender'];
    }
    return false;
  }

  isPartialGender(match: any) {
    return !this.isExactGender(match) && !this.isNotAvailableGender(match);
  }

  isDifferentGender(match: any) {
    return this.isPartialGender(match);
  }

  isNotAvailableGender(match: any) {
    return !(
      match['EntityDetails'] &&
      match['EntityDetails']['Gender'] &&
      match['InputDetails'] &&
      match['InputDetails']['Gender']
    );

    // MatchXML/Gender/Input= Blank OR MatchXML/Gender/List = blank
  }

  isExactEntityType(match: any) {
    // InputDetails/EntityType=EntityDetails/EntityType
    if (
      match['EntityDetails'] &&
      match['EntityDetails']['EntityType'] &&
      match['InputDetails'] &&
      match['InputDetails']['EntityType']
    ) {
      return match['InputDetails']['EntityType'] === match['EntityDetails']['EntityType'];
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
      match['EntityDetails'] &&
      match['EntityDetails']['EntityType'] &&
      match['InputDetails'] &&
      match['InputDetails']['EntityType']
    );
  }
}

const individualRuleEvaluationService = new IndividualRuleEvaluationService();
export default individualRuleEvaluationService;
