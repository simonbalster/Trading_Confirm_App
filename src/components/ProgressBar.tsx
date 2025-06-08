import React from 'react';
import { Step } from '../types';

interface ProgressBarProps {
  steps: Record<string, Step>;
  currentStepId: string;
  completedSteps: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  steps, 
  currentStepId, 
  completedSteps 
}) => {
  // Create an ordered array of steps
  const orderedSteps = React.useMemo(() => {
    const result: Step[] = [];
    let currentStep = Object.values(steps).find(step => step.id === 'forexPairSelection');
    
    while (currentStep) {
      result.push(currentStep);
      currentStep = currentStep.nextStep ? steps[currentStep.nextStep] : undefined;
    }
    
    return result;
  }, [steps]);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {orderedSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStepId;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 dark:bg-green-600 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 dark:bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1 text-center hidden sm:block text-gray-600 dark:text-gray-400">
                  {step.progressBarLabel || step.id.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              
              {/* Connector line (except for the last step) */}
              {index < orderedSteps.length - 1 && (
                <div 
                  className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;