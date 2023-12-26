import individualRuleEvaluationService from "../services/individualsRuleEvaluationService";
import {
    differentAddress, differentLasname, differentMiddlename,
    differentPostCode, exactAka,
    exactCity,
    exactCountry,
    exactGender, exactLasname, exactMiddlename, exactPostCode,
    individualEntity,
    // individualEntity2,
    individualExactDob,
    individualNADob,
    individualPartialDob, isHigh, lowMatchCriteria, mediumMatchCriteria,
    NACountry,
    NAEntityType, NAFirstName,
    NAGender, NALastname,
    notExactEntityType,
    notExactId, notPartialAka, partialAddress,
    partialEntityType,
    partialGender, partialMiddlename, partialPostCode, veryHighRec
} from "../../src/__test__/mocks/entityRecord";

describe('Individual Rule evaluation', () => {
    test('should test for first name match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForFirstName(individualEntity);
        expect(result).toEqual('Partial');
    });

    test('should test for last name match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForLastName(individualEntity);
        expect(result).toEqual('Partial');
    });

    test('should test for middle name match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForMiddleName(individualEntity);
        expect(result).toEqual('Not Available');
    });

    test('should test for date of birth match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForDateOfBirth(individualEntity);
        expect(result).toEqual('Different');
    });

    test('should test for address line 1 match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForAddressLine1(individualEntity);
        expect(result).toEqual('Exact');
    });

    test('should test for country match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForCountry(individualEntity);
        expect(result).toEqual('Different');
    });

    test('should test for city match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForCity(individualEntity);
        expect(result).toEqual('Different');
    });

    test('should test for id match criteria', () => {
        const result = individualRuleEvaluationService.getMatchCriteriaForID(individualEntity);
        expect(result).toEqual('Exact');
    });

    test('should test for parent match criteria', () => {
        const {
            matchProbability,
            ruleEvalDesc
        } = individualRuleEvaluationService.getMatchCriteriaForParentIndividualMatch(individualEntity);
        expect(matchProbability).toEqual('Exact');
        expect(ruleEvalDesc).toEqual('Name + Exact Date Of Birth  + Exact address');
    })

    describe('test an exact match criteria', () => {
        test('should test match criteria is exact', () => {
            const result = individualRuleEvaluationService.isExact(individualEntity);
            expect(result).toEqual(true);
        })
        test('should test match criteria is exact', () => {
            const result = individualRuleEvaluationService.isExact(lowMatchCriteria);
            expect(result).toEqual(false);
        })
    });
    describe('test very high match criteria', () => {
        test('should be a very high match criteria', () => {
            const result = individualRuleEvaluationService.isVeryHigh(veryHighRec);
            expect(result).toEqual(true);
        });

        test('should not be a very high match criteria', () => {
            const result = individualRuleEvaluationService.isVeryHigh(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test high match criteria', () => {
        test('should be a high match criteria', () => {
            const result = individualRuleEvaluationService.isHigh(isHigh);
            expect(result).toEqual(false);
        });

        test('should not be a high match criteria', () => {
            const result = individualRuleEvaluationService.isHigh(individualEntity);
            expect(result).toEqual(false);
        });
    });

    describe('test medium match criteria', () => {
        test('should be a medium match criteria', () => {
            const result = individualRuleEvaluationService.isMedium(mediumMatchCriteria);
            expect(result).toEqual(true);
        })

        test('should not be a medium match criteria', () => {
            const result = individualRuleEvaluationService.isMedium(individualEntity);
            expect(result).toEqual(false);
        })
    })

    describe('test low match criteria', () => {
        test('should be a low  match criteria', () => {
            const result = individualRuleEvaluationService.isLow(lowMatchCriteria);
            expect(result).toEqual(true);
        })

        test('should not be a low  match criteria', () => {
            const result = individualRuleEvaluationService.isLow(individualEntity);
            expect(result).toEqual(false);
        })
    })

    describe('test very low match criteria', () => {
        test('should test match criteria is very low', () => {
            const result = individualRuleEvaluationService.isVeryLow(individualEntity);
            expect(result).toEqual(true);
        });
    })

    describe('test first name', () => {
        test('should be an exact first name', () => {
            const result = individualRuleEvaluationService.isExactFirstName(exactMiddlename);
            expect(result).toEqual(true);
        });

        test('should not be an exact first name', () => {
            const result = individualRuleEvaluationService.isExactFirstName(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial first name', () => {
            const result = individualRuleEvaluationService.isPartialFirstName(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a partial first name', () => {
            const result = individualRuleEvaluationService.isPartialFirstName(exactLasname);
            expect(result).toEqual(false);
        });

        test('should be a different first name', () => {
            const result = individualRuleEvaluationService.isDifferentFirstName(differentMiddlename);
            expect(result).toEqual(true);
        });

        test('should not be a different first name', () => {
            const result = individualRuleEvaluationService.isDifferentFirstName(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available first name', () => {
            const result = individualRuleEvaluationService.isNotAvailableFirstName(NAFirstName);
            expect(result).toEqual(true);
        });

        test('should not be a not available first name', () => {
            const result = individualRuleEvaluationService.isNotAvailableFirstName(partialMiddlename);
            expect(result).toEqual(false);
        });
    })

    describe('test middle name', () => {
        test('should be an exact middle name', () => {
            const result = individualRuleEvaluationService.isExactMiddleName(exactMiddlename);
            expect(result).toEqual(true);
        });

        test('should not be an exact middle name', () => {
            const result = individualRuleEvaluationService.isExactMiddleName(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial middle name', () => {
            const result = individualRuleEvaluationService.isPartialMiddleName(partialMiddlename);
            expect(result).toEqual(true);
        });

        test('should not be a partial middle name', () => {
            const result = individualRuleEvaluationService.isPartialMiddleName(exactLasname);
            expect(result).toEqual(false);
        });

        test('should be a different middle name', () => {
            const result = individualRuleEvaluationService.isDifferentMiddleName(differentMiddlename);
            expect(result).toEqual(true);
        });

        test('should not be a different middle name', () => {
            const result = individualRuleEvaluationService.isDifferentMiddleName(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available middle name', () => {
            const result = individualRuleEvaluationService.isNotAvailableMiddleName(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a not available middle name', () => {
            const result = individualRuleEvaluationService.isNotAvailableMiddleName(partialMiddlename);
            expect(result).toEqual(false);
        });
    })

    describe('test last name', () => {
        test('should be an exact last name', () => {
            const result = individualRuleEvaluationService.isExactLastName(exactLasname);
            expect(result).toEqual(true);
        });

        test('should not be an exact last name', () => {
            const result = individualRuleEvaluationService.isExactLastName(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial last name', () => {
            const result = individualRuleEvaluationService.isPartialLastName(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a partial last name', () => {
            const result = individualRuleEvaluationService.isPartialLastName(exactLasname);
            expect(result).toEqual(false);
        });

        test('should be a different last name', () => {
            const result = individualRuleEvaluationService.isDifferentLastName(differentLasname);
            expect(result).toEqual(true);
        });

        test('should not be a different last name', () => {
            const result = individualRuleEvaluationService.isDifferentLastName(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available last name', () => {
            const result = individualRuleEvaluationService.isNotAvailableLastName(NALastname);
            expect(result).toEqual(true);
        });

        test('should not be a not available last name', () => {
            const result = individualRuleEvaluationService.isNotAvailableLastName(individualEntity);
            expect(result).toEqual(false);
        });
    })


    describe('', () => {
        test('should be an exact aka', () => {
            const result = individualRuleEvaluationService.isExactAKA(exactAka);
            expect(result).toEqual(true);
        });

        test('should not be an exact aka', () => {
            const result = individualRuleEvaluationService.isExactAKA(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial aka', () => {
            const result = individualRuleEvaluationService.isPartialAKA(individualEntity);
            expect(result).toEqual(true);
        })

        test('should not be a partial aka', () => {
            const result = individualRuleEvaluationService.isPartialAKA(notPartialAka);
            expect(result).toEqual(false);
        });

        test('should be a not available aka', () => {
            const result = individualRuleEvaluationService.isNotAvailableAKA(individualEntity);
            expect(result).toEqual(true);
        });
    })

    describe('test address', () => {
        test('should be an exact address', () => {
            const result = individualRuleEvaluationService.isExactAddress(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be an exact address', () => {
            const result = individualRuleEvaluationService.isExactAddress(NACountry);
            expect(result).toEqual(false);
        });

        test('should be a partial address', () => {
            const result = individualRuleEvaluationService.isPartialAddress(partialAddress);
            expect(result).toEqual(true);
        });

        test('should not be a partial address', () => {
            const result = individualRuleEvaluationService.isPartialAddress(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available address', () => {
            const result = individualRuleEvaluationService.isNotAvailableAddress(NACountry);
            expect(result).toEqual(true);
        });

        test('should not be a not available address', () => {
            const result = individualRuleEvaluationService.isNotAvailableAddress(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a different address', () => {
            const result = individualRuleEvaluationService.isDifferentAddress(differentAddress);
            expect(result).toEqual(true);
        });

        test('should not be a different address', () => {
            const result = individualRuleEvaluationService.isDifferentAddress(individualEntity);
            expect(result).toEqual(false);
        });
    })


    describe('test post code', () => {
        test('should be an exact post code', () => {
            const result = individualRuleEvaluationService.isExactPostCode(exactPostCode);
            expect(result).toEqual(true);
        });

        test('should not be an exact post code', () => {
            const result = individualRuleEvaluationService.isExactPostCode(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial post code', () => {
            const result = individualRuleEvaluationService.isPartialPostCode(partialPostCode);
            expect(result).toEqual(true);
        });

        test('should not be a partial post code', () => {
            const result = individualRuleEvaluationService.isPartialPostCode(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available post code', () => {
            const result = individualRuleEvaluationService.isNotAvailablePostCode(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a not available post code', () => {
            const result = individualRuleEvaluationService.isNotAvailablePostCode(exactPostCode);
            expect(result).toEqual(false);
        });

        test('should be a different post code', () => {
            const result = individualRuleEvaluationService.isDifferentPostCode(differentPostCode);
            expect(result).toEqual(true);
        });

        test('should not be a different post code', () => {
            const result = individualRuleEvaluationService.isDifferentPostCode(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test city', () => {
        test('should be an exact city', () => {
            const result = individualRuleEvaluationService.isExactCity(exactCity);
            expect(result).toEqual(true);
        });

        test('should not be an exact city', () => {
            const result = individualRuleEvaluationService.isExactCity(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial city', () => {
            const result = individualRuleEvaluationService.isPartialCity(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a partial city', () => {
            const result = individualRuleEvaluationService.isPartialCity(exactCity);
            expect(result).toEqual(false);
        });

        test('should be a different city', () => {
            const result = individualRuleEvaluationService.isDifferentCity(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a different city', () => {
            const result = individualRuleEvaluationService.isDifferentCity(exactCity);
            expect(result).toEqual(false);
        });

        test('should be a not available city', () => {
            const result = individualRuleEvaluationService.isNotAvailableCity(NACountry);
            expect(result).toEqual(true);
        });

        test('should not be a not available city', () => {
            const result = individualRuleEvaluationService.isNotAvailableCity(individualEntity);
            expect(result).toEqual(false);
        });
    })


    describe('test country', () => {
        test('should be an exact country', () => {
            const result = individualRuleEvaluationService.isExactCountry(exactCountry);
            expect(result).toEqual(true);
        });

        test('should not be an exact country', () => {
            const result = individualRuleEvaluationService.isExactCountry(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial country', () => {
            const result = individualRuleEvaluationService.isPartialCountry(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be partial country', () => {
            const result = individualRuleEvaluationService.isPartialCountry(exactCountry);
            expect(result).toEqual(false);
        });

        test('should be a different country', () => {
            const result = individualRuleEvaluationService.isDifferentCountry(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be different country', () => {
            const result = individualRuleEvaluationService.isDifferentCountry(exactCountry);
            expect(result).toEqual(false);
        });

        test('should be a not available country', () => {
            const result = individualRuleEvaluationService.isNotAvailableCountry(NACountry);
            expect(result).toEqual(true);
        });

        test('should not be a not available country', () => {
            const result = individualRuleEvaluationService.isNotAvailableCountry(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test id', () => {
        test('should be an exact id', () => {
            const result = individualRuleEvaluationService.isExactID(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be an exact id', () => {
            const result = individualRuleEvaluationService.isExactID(notExactId);
            expect(result).toEqual(false);
        });

        test('should not be a partial id', () => {
            const result = individualRuleEvaluationService.isPartialID(individualEntity);
            expect(result).toEqual(false);
        });

        test('should not be a different id', () => {
            const result = individualRuleEvaluationService.isDifferentID(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available id', () => {
            const result = individualRuleEvaluationService.isNotAvailableID(notExactId);
            expect(result).toEqual(true);
        });

        test('should not be a not available id', () => {
            const result = individualRuleEvaluationService.isNotAvailableID(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test gender', () => {
        test('should be an exact gender', () => {
            const result = individualRuleEvaluationService.isExactGender(exactGender);
            expect(result).toEqual(true);
        });

        test('should not be an exact gender', () => {
            const result = individualRuleEvaluationService.isExactGender(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial gender', () => {
            const result = individualRuleEvaluationService.isPartialGender(partialGender);
            expect(result).toEqual(true);
        });

        test('should not be a partial gender', () => {
            const result = individualRuleEvaluationService.isPartialGender(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a different gender', () => {
            const result = individualRuleEvaluationService.isDifferentGender(partialGender);
            expect(result).toEqual(true);
        });

        test('should not be a different gender', () => {
            const result = individualRuleEvaluationService.isDifferentGender(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available gender', () => {
            const result = individualRuleEvaluationService.isNotAvailableGender(NAGender);
            expect(result).toEqual(true);
        });

        test('should not be a not available gender', () => {
            const result = individualRuleEvaluationService.isNotAvailableGender(exactGender);
            expect(result).toEqual(false);
        });
    })


    describe('test entity type', () => {
        test('should be an exact entity type', () => {
            const result = individualRuleEvaluationService.isExactEntityType(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be an exact entity type', () => {
            const result = individualRuleEvaluationService.isExactEntityType(notExactEntityType);
            expect(result).toEqual(false);
        });

        test('should be a partial entity type', () => {
            const result = individualRuleEvaluationService.isPartialEntityType(partialEntityType);
            expect(result).toEqual(true);
        });

        test('should not be a partial entity type', () => {
            const result = individualRuleEvaluationService.isPartialEntityType(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a different entity type', () => {
            const result = individualRuleEvaluationService.isDifferentEntityType(partialEntityType);
            expect(result).toEqual(true);
        });

        test('should not be a different entity type', () => {
            const result = individualRuleEvaluationService.isDifferentEntityType(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available entity type', () => {
            const result = individualRuleEvaluationService.isNotAvailableEntityType(NAEntityType);
            expect(result).toEqual(true);
        });

        test('should not be a not available entity type', () => {
            const result = individualRuleEvaluationService.isNotAvailableEntityType(individualEntity);
            expect(result).toEqual(false);
        });
    });

    describe('test dobs', () => {

        test('should be an exact dob', () => {
            const result = individualRuleEvaluationService.isExactDOB(individualExactDob);
            expect(result).toEqual(true);
        });

        test('should not be an exact dob', () => {
            const result = individualRuleEvaluationService.isExactDOB(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial dob', () => {
            const result = individualRuleEvaluationService.isPartialDOB(individualPartialDob);
            expect(result).toEqual(true);
        });

        test('should not be a partial dob', () => {
            const result = individualRuleEvaluationService.isPartialDOB(individualEntity);
            expect(result).toEqual(false);
        });

        test('should pass for not available dob', () => {
            const result = individualRuleEvaluationService.isNotAvailableDOB(individualNADob);
            expect(result).toEqual(true);
        });

        test('should not pass for not available dob', () => {
            const result = individualRuleEvaluationService.isNotAvailableDOB(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a different dob', () => {
            const result = individualRuleEvaluationService.isDifferentDOB(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a different dob', () => {
            const result = individualRuleEvaluationService.isDifferentDOB(individualPartialDob);
            expect(result).toEqual(false);
        });
    });

});
