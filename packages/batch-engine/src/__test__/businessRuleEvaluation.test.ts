import {
    differentAddress, differentLasname, differentMiddlename,
    differentPostCode, exactAka,
    exactCity,
    exactCountry, exactIdBusiness,
    exactLasname, exactPostCode,
    individualEntity,
    isHigh, isMediumBusiness, lowBusiness, lowMatchCriteria,
    NACountry,
    NAEntityType, NAFirstName,
    notExactEntityType,
    notExactId, partialAddress,
    partialEntityType,
    partialMiddlename, partialPostCode
} from "../../src/__test__/mocks/entityRecord";
import businessRuleEvaluationService from "../services/businessRuleEvaluationService";

describe('Business Rule evaluation', () => {
    // test('should test for first name match criteria', () => {
    //     const result = businessRuleEvaluationService.getMatchCriteriaForName(individualEntity);
    //     expect(result).toEqual('Partial');
    // });

    test('should test for address line 1 match criteria', () => {
        const result = businessRuleEvaluationService.getMatchCriteriaForAddressLine1(individualEntity);
        expect(result).toEqual('Exact');
    });

    test('should test for country match criteria', () => {
        const result = businessRuleEvaluationService.getMatchCriteriaForCountry(individualEntity);
        expect(result).toEqual('Different');
    });

    test('should test for city match criteria', () => {
        const result = businessRuleEvaluationService.getMatchCriteriaForCity(individualEntity);
        expect(result).toEqual('Different');
    });

    // test('should test for id match criteria', () => {
    //     const result = businessRuleEvaluationService.getMatchCriteriaForID(individualEntity);
    //     expect(result).toEqual('Exact');
    // });

    test('should test for parent match criteria', () => {
        const {
            matchProbability,
            ruleEvalDesc
        } = businessRuleEvaluationService.getMatchCriteriaForParentBusinessMatch(individualEntity);
        expect(matchProbability).toEqual('Exact');
        expect(ruleEvalDesc).toEqual('Name + Exact address or Registration number');
    })

    describe('test an exact match criteria', () => {
        test('should test match criteria is exact', () => {
            const result = businessRuleEvaluationService.isExact(individualEntity);
            expect(result).toEqual(true);
        })
        test('should test match criteria is exact', () => {
            const result = businessRuleEvaluationService.isExact(lowMatchCriteria);
            expect(result).toEqual(false);
        })
    });
    describe('test very high match criteria', () => {
        // test('should be a very high match criteria', () => {
        //     const result = businessRuleEvaluationService.isVeryHigh(veryHighRec);
        //     expect(result).toEqual(true);
        // });

        test('should not be a very high match criteria', () => {
            const result = businessRuleEvaluationService.isVeryHigh(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test high match criteria', () => {
        test('should be a high match criteria', () => {
            const result = businessRuleEvaluationService.isHigh(isHigh);
            expect(result).toEqual(false);
        });

        test('should not be a high match criteria', () => {
            const result = businessRuleEvaluationService.isHigh(individualEntity);
            expect(result).toEqual(false);
        });
    });

    describe('test medium match criteria', () => {
        test('should be a medium match criteria', () => {
            const result = businessRuleEvaluationService.isMedium(isMediumBusiness);
            expect(result).toEqual(true);
        })

        test('should not be a medium match criteria', () => {
            const result = businessRuleEvaluationService.isMedium(individualEntity);
            expect(result).toEqual(false);
        })
    })

    describe('test low match criteria', () => {
        test('should be a low  match criteria', () => {
            const result = businessRuleEvaluationService.isLow(lowBusiness);
            expect(result).toEqual(true);
        })

        test('should not be a low  match criteria', () => {
            const result = businessRuleEvaluationService.isLow(individualEntity);
            expect(result).toEqual(false);
        })
    })

    describe('test very low match criteria', () => {
        test('should test match criteria is very low', () => {
            const result = businessRuleEvaluationService.isVeryLow(individualEntity);
            expect(result).toEqual(true);
        });
    })

    describe('test full name', () => {
        test('should be an exact name', () => {
            const result = businessRuleEvaluationService.isExactName(isMediumBusiness);
            expect(result).toEqual(true);
        });

        test('should not be an exact name', () => {
            const result = businessRuleEvaluationService.isExactName(differentLasname);
            expect(result).toEqual(false);
        });

        test('should be a partial name', () => {
            const result = businessRuleEvaluationService.isPartialName(differentLasname);
            expect(result).toEqual(true);
        });

        test('should not be a partial name', () => {
            const result = businessRuleEvaluationService.isPartialName(exactLasname);
            expect(result).toEqual(false);
        });

        test('should be a different name', () => {
            const result = businessRuleEvaluationService.isDifferentName(differentMiddlename);
            expect(result).toEqual(true);
        });

        test('should not be a different name', () => {
            const result = businessRuleEvaluationService.isDifferentName(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available name', () => {
            const result = businessRuleEvaluationService.isNotAvailableName(NAFirstName);
            expect(result).toEqual(true);
        });

        test('should not be a not available name', () => {
            const result = businessRuleEvaluationService.isNotAvailableName(partialMiddlename);
            expect(result).toEqual(false);
        });
    })

    describe('test aka', () => {
        test('should be an exact aka', () => {
            const result = businessRuleEvaluationService.isExactAKA(exactAka);
            expect(result).toEqual(true);
        });

        test('should not be an exact aka', () => {
            const result = businessRuleEvaluationService.isExactAKA(differentLasname);
            expect(result).toEqual(false);
        });

        test('should be a partial aka', () => {
            const result = businessRuleEvaluationService.isPartialAKA(differentLasname);
            expect(result).toEqual(true);
        })

        test('should not be a partial aka', () => {
            const result = businessRuleEvaluationService.isPartialAKA(exactAka);
            expect(result).toEqual(false);
        });

        // test('should be a not available aka', () => {
        //     const result = businessRuleEvaluationService.isNotAvailableAKA(exactLasname);
        //     expect(result).toEqual(true);
        // });
    })

    describe('test address', () => {
        test('should be an exact address', () => {
            const result = businessRuleEvaluationService.isExactAddress(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be an exact address', () => {
            const result = businessRuleEvaluationService.isExactAddress(NACountry);
            expect(result).toEqual(false);
        });

        test('should be a partial address', () => {
            const result = businessRuleEvaluationService.isPartialAddress(partialAddress);
            expect(result).toEqual(true);
        });

        test('should not be a partial address', () => {
            const result = businessRuleEvaluationService.isPartialAddress(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available address', () => {
            const result = businessRuleEvaluationService.isNotAvailableAddress(NACountry);
            expect(result).toEqual(true);
        });

        test('should not be a not available address', () => {
            const result = businessRuleEvaluationService.isNotAvailableAddress(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a different address', () => {
            const result = businessRuleEvaluationService.isDifferentAddress(differentAddress);
            expect(result).toEqual(true);
        });

        test('should not be a different address', () => {
            const result = businessRuleEvaluationService.isDifferentAddress(individualEntity);
            expect(result).toEqual(false);
        });
    })


    describe('test post code', () => {
        test('should be an exact post code', () => {
            const result = businessRuleEvaluationService.isExactPostCode(exactPostCode);
            expect(result).toEqual(true);
        });

        test('should not be an exact post code', () => {
            const result = businessRuleEvaluationService.isExactPostCode(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial post code', () => {
            const result = businessRuleEvaluationService.isPartialPostCode(partialPostCode);
            expect(result).toEqual(true);
        });

        test('should not be a partial post code', () => {
            const result = businessRuleEvaluationService.isPartialPostCode(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available post code', () => {
            const result = businessRuleEvaluationService.isNotAvailablePostCode(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a not available post code', () => {
            const result = businessRuleEvaluationService.isNotAvailablePostCode(exactPostCode);
            expect(result).toEqual(false);
        });

        test('should be a different post code', () => {
            const result = businessRuleEvaluationService.isDifferentPostCode(differentPostCode);
            expect(result).toEqual(true);
        });

        test('should not be a different post code', () => {
            const result = businessRuleEvaluationService.isDifferentPostCode(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test city', () => {
        test('should be an exact city', () => {
            const result = businessRuleEvaluationService.isExactCity(exactCity);
            expect(result).toEqual(true);
        });

        test('should not be an exact city', () => {
            const result = businessRuleEvaluationService.isExactCity(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial city', () => {
            const result = businessRuleEvaluationService.isPartialCity(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a partial city', () => {
            const result = businessRuleEvaluationService.isPartialCity(exactCity);
            expect(result).toEqual(false);
        });

        test('should be a different city', () => {
            const result = businessRuleEvaluationService.isDifferentCity(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be a different city', () => {
            const result = businessRuleEvaluationService.isDifferentCity(exactCity);
            expect(result).toEqual(false);
        });

        test('should be a not available city', () => {
            const result = businessRuleEvaluationService.isNotAvailableCity(NACountry);
            expect(result).toEqual(true);
        });

        test('should not be a not available city', () => {
            const result = businessRuleEvaluationService.isNotAvailableCity(individualEntity);
            expect(result).toEqual(false);
        });
    })


    describe('test country', () => {
        test('should be an exact country', () => {
            const result = businessRuleEvaluationService.isExactCountry(exactCountry);
            expect(result).toEqual(true);
        });

        test('should not be an exact country', () => {
            const result = businessRuleEvaluationService.isExactCountry(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a partial country', () => {
            const result = businessRuleEvaluationService.isPartialCountry(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be partial country', () => {
            const result = businessRuleEvaluationService.isPartialCountry(exactCountry);
            expect(result).toEqual(false);
        });

        test('should be a different country', () => {
            const result = businessRuleEvaluationService.isDifferentCountry(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be different country', () => {
            const result = businessRuleEvaluationService.isDifferentCountry(exactCountry);
            expect(result).toEqual(false);
        });

        test('should be a not available country', () => {
            const result = businessRuleEvaluationService.isNotAvailableCountry(NACountry);
            expect(result).toEqual(true);
        });

        test('should not be a not available country', () => {
            const result = businessRuleEvaluationService.isNotAvailableCountry(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test id', () => {
        test('should be an exact id', () => {
            const result = businessRuleEvaluationService.isExactID(exactIdBusiness);
            expect(result).toEqual(true);
        });

        test('should not be an exact id', () => {
            const result = businessRuleEvaluationService.isExactID(notExactId);
            expect(result).toEqual(false);
        });

        test('should not be a partial id', () => {
            const result = businessRuleEvaluationService.isPartialID(individualEntity);
            expect(result).toEqual(false);
        });

        test('should not be a different id', () => {
            const result = businessRuleEvaluationService.isDifferentID(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available id', () => {
            const result = businessRuleEvaluationService.isNotAvailableID(notExactId);
            expect(result).toEqual(true);
        });

        test('should not be a not available id', () => {
            const result = businessRuleEvaluationService.isNotAvailableID(individualEntity);
            expect(result).toEqual(false);
        });
    })

    describe('test entity type', () => {
        test('should be an exact entity type', () => {
            const result = businessRuleEvaluationService.isExactEntityType(individualEntity);
            expect(result).toEqual(true);
        });

        test('should not be an exact entity type', () => {
            const result = businessRuleEvaluationService.isExactEntityType(notExactEntityType);
            expect(result).toEqual(false);
        });

        test('should be a partial entity type', () => {
            const result = businessRuleEvaluationService.isPartialEntityType(partialEntityType);
            expect(result).toEqual(true);
        });

        test('should not be a partial entity type', () => {
            const result = businessRuleEvaluationService.isPartialEntityType(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a different entity type', () => {
            const result = businessRuleEvaluationService.isDifferentEntityType(partialEntityType);
            expect(result).toEqual(true);
        });

        test('should not be a different entity type', () => {
            const result = businessRuleEvaluationService.isDifferentEntityType(individualEntity);
            expect(result).toEqual(false);
        });

        test('should be a not available entity type', () => {
            const result = businessRuleEvaluationService.isNotAvailableEntityType(NAEntityType);
            expect(result).toEqual(true);
        });

        test('should not be a not available entity type', () => {
            const result = businessRuleEvaluationService.isNotAvailableEntityType(individualEntity);
            expect(result).toEqual(false);
        });
    });

});
