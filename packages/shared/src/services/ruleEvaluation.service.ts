import individualRuleEvaluationService from "./individualsRuleEvaluation.service";
import businessRuleEvaluationService from "./businessRuleEvaluation.service";

class RuleEvaluationService {
  constructor() {}

  evaluateRules(mappedMatches: any[], entityType: string) {
    const finalMatches: any[] = [];
    if (entityType === 'Individual') {
      mappedMatches.forEach((mappedMatch) => {
        finalMatches.push(individualRuleEvaluationService.evaluateRulesForIndividual(mappedMatch));
      });
    } else {
      mappedMatches.forEach((mappedMatch) => {
        finalMatches.push(businessRuleEvaluationService.evaluateRulesForBusiness(mappedMatch));
      });
    }
    return finalMatches;
  }
}

const ruleEvaluationService = new RuleEvaluationService();
export default ruleEvaluationService;
