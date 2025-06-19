import { Rule, ValidationResult, RuleStatus } from '../types';

const isRuleApplicable = (
  rule: Rule, 
  allRules: Rule[], 
  allRuleAnswers: Record<string, RuleStatus>,
  allSelectedRuleOutcomes: Record<string, string | null> = {}
): boolean => {
  if (!rule.condition) {
    return true; // Rule has no condition, so it's always applicable
  }

  const { dependsOnRuleId, checkParentDescription, checkParentOutcomeId } = rule.condition;
  const parentRuleStatus = allRuleAnswers[dependsOnRuleId];
  
  // Parent rule must be satisfied for this rule to be applicable
  if (parentRuleStatus !== 'satisfied') {
    return false;
  }

  // If there's an outcome check, verify the parent rule has the specified outcome selected
  if (checkParentOutcomeId) {
    const parentSelectedOutcome = allSelectedRuleOutcomes[dependsOnRuleId];
    if (parentSelectedOutcome !== checkParentOutcomeId) {
      return false;
    }
  }

  // If there's a description check, verify the parent rule contains the specified text
  if (checkParentDescription) {
    const parentRule = allRules.find(r => r.id === dependsOnRuleId);
    if (!parentRule || !parentRule.description.includes(checkParentDescription)) {
      return false;
    }
  }

  return true;
};

export const validateRules = (
  selectedOption: string | null,
  rules: Rule[],
  answers: Record<string, RuleStatus>,
  stepTitle: string,
  selectedRuleOutcomes: Record<string, string | null> = {}
): ValidationResult => {
  if (!selectedOption) {
    return {
      valid: false,
      message: 'Please select an option to continue'
    };
  }

  // Filter rules based on their conditions and N/A status
  const applicableRules = rules.filter((rule) => {
    // Skip rules marked as N/A
    if (answers[rule.id] === 'na') {
      return false;
    }
    
    // Check if rule is applicable based on its condition
    return isRuleApplicable(rule, rules, answers, selectedRuleOutcomes);
  });
  
  // Check if all applicable rules are satisfied
  const failedRules = applicableRules.filter((rule) => answers[rule.id] !== 'satisfied');
  
  // Check if rules with outcomes have outcomes selected when satisfied
  const rulesWithOutcomesNotSelected = applicableRules.filter((rule) => {
    return rule.outcomes && 
           rule.outcomes.length > 0 && 
           answers[rule.id] === 'satisfied' && 
           !selectedRuleOutcomes[rule.id];
  });
  
  if (rulesWithOutcomesNotSelected.length > 0) {
    return {
      valid: false,
      message: `Please select an outcome for: ${rulesWithOutcomesNotSelected.map(r => r.description.split('.')[0]).join(', ')}`
    };
  }
  
  if (failedRules.length === 0) {
    return {
      valid: true,
      message: `${stepTitle} valid - All applicable rules are satisfied!`
    };
  }
  
  return {
    valid: false,
    message: `Rules not satisfied: ${failedRules.map(r => r.description).join(', ')}`
  };
};

export { isRuleApplicable };