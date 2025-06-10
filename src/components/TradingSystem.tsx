import React from 'react';
import StepContainer from './StepContainer';
import ProgressBar from './ProgressBar';
import steps from '../data/steps';
import forexPairs from '../data/forexPairs';
import { StepState, StepsState, ForexPair, TradeDirection } from '../types';
import { BarChart2, TrendingUp, TrendingDown, Sun, Moon } from 'lucide-react';

interface TradingSystemProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const TradingSystem: React.FC<TradingSystemProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [currentStepId, setCurrentStepId] = React.useState<string | null>('forexPairSelection');
  const [selectedForexPair, setSelectedForexPair] = React.useState<ForexPair | null>(null);
  const [tradeDirection, setTradeDirection] = React.useState<TradeDirection>('buy');
  const [stepsState, setStepsState] = React.useState<StepsState>(() => {
    return Object.fromEntries(
      Object.values(steps).map(step => [
        step.id, 
        { selectedOption: null, validationResult: null }
      ])
    );
  });

  const completedSteps = React.useMemo(() => {
    return Object.entries(stepsState)
      .filter(([_, state]) => state.validationResult?.valid)
      .map(([id]) => id);
  }, [stepsState]);

  const handleUpdateStepState = (stepId: string, newState: StepState) => {
    setStepsState(prev => ({
      ...prev,
      [stepId]: newState
    }));

    // If this is the forex pair selection step, update the selected forex pair
    if (stepId === 'forexPairSelection' && newState.selectedOption) {
      const pair = forexPairs.find(p => p.id === newState.selectedOption);
      if (pair) {
        setSelectedForexPair(pair);
      }
    }
  };

  const handleNextStep = (nextStepId: string | undefined) => {
    if (nextStepId) {
      setCurrentStepId(nextStepId);
    } else {
      // If nextStepId is undefined, we've completed all steps
      setCurrentStepId(null);
    }
  };

  const handleReset = () => {
    setCurrentStepId('forexPairSelection');
    setSelectedForexPair(null);
    setStepsState(
      Object.fromEntries(
        Object.values(steps).map(step => [
          step.id,
          { selectedOption: null, validationResult: null }
        ])
      )
    );
  };

  const handleTradeDirectionChange = (direction: TradeDirection) => {
    setTradeDirection(direction);
    // Reset validation state when direction changes
    setStepsState(
      Object.fromEntries(
        Object.values(steps).map(step => [
          step.id,
          { selectedOption: null, validationResult: null }
        ])
      )
    );
    setCurrentStepId('forexPairSelection');
    setSelectedForexPair(null);
  };

  const currentStep = currentStepId ? steps[currentStepId] : null;

  // Get the previous step's selected option for dynamic options
  const getPrevStepSelectedOption = (stepId: string): string | null => {
    const stepIds = Object.keys(steps);
    const currentIndex = stepIds.indexOf(stepId);
    
    if (currentIndex > 0) {
      const prevStepId = stepIds[currentIndex - 1];
      return stepsState[prevStepId]?.selectedOption || null;
    }
    
    return null;
  };

  const prevStepSelectedOption = currentStepId ? getPrevStepSelectedOption(currentStepId) : null;

  // Generate the final validation message with H4 and H1 selections
  const getFinalValidationMessage = () => {
    const h4Selection = stepsState['h4Initial']?.selectedOption;
    const h1Selection = stepsState['h1Confirmation']?.selectedOption;
    
    if (!selectedForexPair || !h4Selection || !h1Selection) {
      return `${tradeDirection.toUpperCase()} trade is valid and ready for execution!`;
    }

    // Find the labels for the selected options
    const h4Option = steps['h4Initial'].options.find(opt => opt.id === h4Selection);
    const h1Option = steps['h1Confirmation'].options.find(opt => opt.id === h1Selection);
    
    const h4Label = h4Option?.label || h4Selection;
    const h1Label = h1Option?.label || h1Selection;
    
    return `${selectedForexPair.symbol} - ${h4Label} with ${h1Label} Confirm ${tradeDirection.toUpperCase()} setup is valid and ready for execution!`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div className="flex items-center justify-center">
            <BarChart2 size={28} className="text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Forex Trading Validation System
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Validate your trading setup against proven rules</p>
        
        {/* Display selected forex pair with dynamic styling based on trade direction */}
        {selectedForexPair && (
          <div className={`mt-4 inline-flex items-center px-4 py-2 border rounded-lg ${
            tradeDirection === 'buy' 
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
          }`}>
            {tradeDirection === 'buy' ? (
              <TrendingUp size={20} className="text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <TrendingDown size={20} className="text-red-600 dark:text-red-400 mr-2" />
            )}
            <div className="text-left">
              <div className={`text-lg font-bold ${
                tradeDirection === 'buy' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {selectedForexPair.symbol}
              </div>
              <div className={`text-xs capitalize ${
                tradeDirection === 'buy' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {selectedForexPair.category} pair
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ProgressBar 
        steps={steps}
        currentStepId={currentStepId || 'forexPairSelection'}
        completedSteps={completedSteps}
      />
      
      {currentStep && (
        <StepContainer
          key={currentStep.id}
          step={currentStep}
          stepState={stepsState[currentStep.id]}
          onUpdateState={handleUpdateStepState}
          onNext={handleNextStep}
          onReset={handleReset}
          prevStepSelectedOption={prevStepSelectedOption}
          tradeDirection={tradeDirection}
          onTradeDirectionChange={handleTradeDirectionChange}
        />
      )}
      
      {!currentStep && completedSteps.includes('h1Confirmation') && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl shadow-sm p-6 text-center animate-fadeIn">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-3">All Trading Rules Validated!</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            All timeframe validation steps have been completed successfully for <strong>{selectedForexPair?.symbol}</strong> {tradeDirection} setup.
          </p>
          <p className="text-green-700 dark:text-green-300 font-medium mb-4">{getFinalValidationMessage()}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Start New Validation
          </button>
        </div>
      )}
    </div>
  );
};

export default TradingSystem;