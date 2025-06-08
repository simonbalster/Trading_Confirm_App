export interface ImageInfo {
  url: string;
  alt?: string;
}

export type RuleStatus = 'satisfied' | 'not_satisfied' | 'na';

export interface Rule {
  id: string;
  description: string;
  exceptions?: string[];
  images?: ImageInfo[];
  allowNA?: boolean;
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
  getRules?: (selectedOption: string) => Rule[];
  getOptions?: (prevStepSelectedOption: string | null) => Option[];
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface StepState {
  selectedOption: string | null;
  validationResult: ValidationResult | null;
}

export type StepsState = Record<string, StepState>;