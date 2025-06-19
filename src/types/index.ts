export interface ImageInfo {
  url: string;
  alt?: string;
}

export type RuleStatus = 'satisfied' | 'not_satisfied' | 'na';

export type TradeDirection = 'buy' | 'sell';

export interface RuleCondition {
  dependsOnRuleId: string;
  checkParentDescription?: string;
}

export interface Rule {
  id: string;
  description: string;
  exceptions?: string[];
  images?: ImageInfo[];
  allowNA?: boolean;
  condition?: RuleCondition;
}

export interface Option {
  id: string;
  label: string;
}

export interface ForexPair {
  id: string;
  label: string;
  symbol: string;
  category: 'major' | 'minor' | 'exotic';
}

export interface Step {
  id: string;
  title: string;
  description: string;
  options: Option[];
  rules: Rule[];
  nextStep?: string;
  progressBarLabel?: string;
  getRules?: (selectedOption: string, tradeDirection?: TradeDirection) => Rule[];
  getOptions?: (prevStepSelectedOption: string | null, tradeDirection?: TradeDirection, prevStepRuleAnswers?: Record<string, RuleStatus>) => Option[];
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface StepState {
  selectedOption: string | null;
  validationResult: ValidationResult | null;
  ruleAnswers?: Record<string, RuleStatus>;
}

export type StepsState = Record<string, StepState>;