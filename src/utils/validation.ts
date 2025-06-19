import { Rule, ValidationResult, RuleStatus } from '../types';

const isRuleApplicable = (rule: Rule, allRules: Rule[], allRuleAnswers: Record<string, RuleStatus>): boolean => {
  if (!rule.condition) {
    return true; // Rule has no condition, so it's always applicable
  }

  const { dependsOnRuleId, checkParentDescription } = rule.condition;
  const parentRuleStatus = allRuleAnswers[dependsOnRuleId];
  
  // Parent rule must be satisfied for this rule to be applicable
  if (parentRuleStatus !== 'satisfied') {
    return false;
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
  stepTitle: string
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
    return isRuleApplicable(rule, rules, answers);
  });
  
  // Check if all applicable rules are satisfied
  const failedRules = applicableRules.filter((rule) => answers[rule.id] !== 'satisfied');
  
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