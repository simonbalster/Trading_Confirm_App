import React from 'react';
import { Step, StepState, ValidationResult, RuleStatus } from '../types';
import Dropdown from './Dropdown';
import RuleItem from './RuleItem';
import { validateRules } from '../utils/validation';
import { ChevronRight, CheckCircle, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';

interface StepContainerProps {
  step: Step;
  stepState: StepState;
  onUpdateState: (stepId: string, state: StepState) => void;
  onNext: (nextStepId: string | undefined) => void;
  onReset: () => void;
  prevStepSelectedOption?: string | null;
}

const StepContainer: React.FC<StepContainerProps> = ({
  step,
  stepState,
  onUpdateState,
  onNext,
  onReset,
  prevStepSelectedOption = null,
}) => {
  const [ruleAnswers, setRuleAnswers] = React.useState<Record<string, RuleStatus>>({});
  const [selectedRuleId, setSelectedRuleId] = React.useState<string | null>(null);
  
  const currentRules = React.useMemo(() => {
    if (step.getRules && stepState.selectedOption) {
      return step.getRules(stepState.selectedOption);
    }
    return step.rules;
  }, [step, stepState.selectedOption]);

  // Get dynamic options if available, otherwise use static options
  const availableOptions = React.useMemo(() => {
    if (step.getOptions) {
      return step.getOptions(prevStepSelectedOption);
    }
    return step.options;
  }, [step, prevStepSelectedOption]);

  // Only NonMANIPIB and NonMANIPNONMSBENGULF are single selection steps
  const isSingleSelectionStep = stepState.selectedOption === 'NonMANIPIB' || stepState.selectedOption === 'NonMANIPNONMSBENGULF';

  // Special handling for forex pair selection step
  const isForexPairSelection = step.id === 'forexPairSelection';

  React.useEffect(() => {
    if (isSingleSelectionStep) {
      // For single selection steps, initialize with all rules not_satisfied and no selection
      setRuleAnswers(
        Object.fromEntries(currentRules.map(rule => [rule.id, 'not_satisfied' as RuleStatus]))
      );
      setSelectedRuleId(null);
    } else {
      // For other options, initialize normally
      setRuleAnswers(
        Object.fromEntries(currentRules.map(rule => [rule.id, 'not_satisfied' as RuleStatus]))
      );
      setSelectedRuleId(null);
    }
  }, [currentRules, isSingleSelectionStep]);

  const handleOptionSelect = (optionId: string) => {
    onUpdateState(step.id, {
      ...stepState,
      selectedOption: optionId,
      validationResult: null
    });
  };

  const handleRuleStatusChange = (ruleId: string, status: RuleStatus) => {
    if (isSingleSelectionStep) {
      // For single selection steps, only allow one rule to be selected
      if (selectedRuleId === ruleId && status === 'satisfied') {
        // Deselect if clicking the same rule
        setSelectedRuleId(null);
        setRuleAnswers(
          Object.fromEntries(currentRules.map(rule => [rule.id, 'not_satisfied' as RuleStatus]))
        );
      } else if (status === 'satisfied') {
        // Select new rule and mark it as satisfied
        setSelectedRuleId(ruleId);
        setRuleAnswers(
          Object.fromEntries(currentRules.map(rule => [rule.id, rule.id === ruleId ? 'satisfied' as RuleStatus : 'not_satisfied' as RuleStatus]))
        );
      }
    } else {
      // For other options, allow multiple selections and N/A
      const newRuleAnswers = {
        ...ruleAnswers,
        [ruleId]: status
      };
      setRuleAnswers(newRuleAnswers);
    }
  };

  const handleValidate = () => {
    let validationResult: ValidationResult;
    
    if (isForexPairSelection) {
      // For forex pair selection, just check if an option is selected
      if (stepState.selectedOption) {
        validationResult = {
          valid: true,
          message: `Instrument selected successfully! Proceeding to H4 validation...`
        };
      } else {
        validationResult = {
          valid: false,
          message: 'Please select a trading instrument to continue'
        };
      }
    } else if (isSingleSelectionStep) {
      // For single selection steps, check if exactly one rule is selected and validated
      const selectedRules = Object.entries(ruleAnswers).filter(([_, status]) => status === 'satisfied');
      
      if (selectedRules.length === 0) {
        validationResult = {
          valid: false,
          message: 'Please select exactly one rule that applies to your setup'
        };
      } else if (selectedRules.length === 1) {
        validationResult = {
          valid: true,
          message: `${step.title} valid - Rule validated successfully! ${step.nextStep ? 'Proceeding to next step...' : 'Trading plan validation complete!'}`
        };
      } else {
        validationResult = {
          valid: false,
          message: 'Only one rule can be selected for this setup type'
        };
      }
    } else {
      // For other options, use the standard validation with step title
      validationResult = validateRules(
        stepState.selectedOption,
        currentRules,
        ruleAnswers,
        step.title
      );
    }

    onUpdateState(step.id, {
      ...stepState,
      validationResult
    });

    if (validationResult.valid) {
      if (step.nextStep) {
        setTimeout(() => {
          onNext(step.nextStep);
        }, 3000); // Increased from 1000ms to 3000ms (3 seconds)
      } else {
        // This is the final step, trigger completion
        setTimeout(() => {
          onNext(undefined);
        }, 3000); // Increased from 1000ms to 3000ms (3 seconds)
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-5 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{step.title}</h2>
        <button
          onClick={onReset}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <RotateCcw size={16} className="mr-1" />
          Reset
        </button>
      </div>
      <p className="text-gray-600 mb-4">{step.description}</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isForexPairSelection ? 'Select Instrument' : 'Select Option'}
        </label>
        <Dropdown
          options={availableOptions}
          selectedOption={stepState.selectedOption}
          onSelect={handleOptionSelect}
          placeholder={isForexPairSelection ? 'Choose a trading instrument...' : 'Select an option'}
        />
      </div>

      {stepState.selectedOption && !isForexPairSelection && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {isSingleSelectionStep ? 'Select the ONE rule that applies:' : 'Validation Rules'}
          </h3>
          {isSingleSelectionStep && (
            <p className="text-xs text-blue-600 mb-3 bg-blue-50 p-2 rounded-lg border border-blue-200">
              <strong>Important:</strong> You only need one of below rules to meet the requirements. 
              Multiple selections are not permitted.
            </p>
          )}
          <div className="space-y-2">
            {currentRules.map((rule) => (
              <RuleItem
                key={rule.id}
                rule={rule}
                ruleStatus={ruleAnswers[rule.id] || 'not_satisfied'}
                onStatusChange={handleRuleStatusChange}
                isSelected={isSingleSelectionStep ? selectedRuleId === rule.id : undefined}
                singleSelection={isSingleSelectionStep}
              />
            ))}
          </div>
        </div>
      )}

      {stepState.validationResult && (
        <div className={`mb-4 p-4 rounded-xl border-2 transition-all duration-300 ${
          stepState.validationResult.valid 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg animate-celebration' 
            : 'bg-red-50 border-red-200'
        }`}>
          {stepState.validationResult.valid ? (
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <CheckCircle size={28} className="text-green-600" />
                  <Sparkles size={16} className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-800 mb-1">
                    🎉 Validation Successful!
                  </h3>
                  <p className="text-green-700 font-medium">
                    {stepState.validationResult.message}
                  </p>
                </div>
                <div className="relative">
                  <CheckCircle size={28} className="text-green-600" />
                  <Sparkles size={16} className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2 text-red-600" />
              <p className="text-sm text-red-800">{stepState.validationResult.message}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          onClick={handleValidate}
          disabled={!stepState.selectedOption}
        >
          {isForexPairSelection ? 'Continue' : 'Validate'}
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default StepContainer;