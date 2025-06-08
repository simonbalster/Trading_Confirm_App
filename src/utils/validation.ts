import { Rule, ValidationResult, RuleStatus } from '../types';

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

  // Filter out rules that are marked as N/A
  const applicableRules = rules.filter((rule) => answers[rule.id] !== 'na');
  
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