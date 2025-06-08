import React from 'react';
import StepContainer from './StepContainer';
import ProgressBar from './ProgressBar';
import steps from '../data/steps';
import forexPairs from '../data/forexPairs';
import { StepState, StepsState, ForexPair, TradeDirection } from '../types';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';

const TradingSystem: React.FC = () => {
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
        <div className="flex items-center justify-center mb-2">
          <BarChart2 size={28} className="text-blue-600 mr-2" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Forex Trading Validation System</h1>
        </div>
        <p className="text-gray-600">Validate your trading setup against proven rules</p>
        
        {/* Trade Direction Toggle */}
        <div className="mt-6 mb-4">
          <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-lg p-1 max-w-xs mx-auto">
            <button
              onClick={() => handleTradeDirectionChange('buy')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                tradeDirection === 'buy'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <TrendingUp size={16} className="mr-1" />
              Buy Setup
            </button>
            <button
              onClick={() => handleTradeDirectionChange('sell')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                tradeDirection === 'sell'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <TrendingDown size={16} className="mr-1" />
              Sell Setup
            </button>
          </div>
        </div>
        
        {/* Display selected forex pair */}
        {selectedForexPair && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <TrendingUp size={20} className="text-blue-600 mr-2" />
            <div className="text-left">
              <div className="text-lg font-bold text-blue-800">{selectedForexPair.symbol}</div>
              <div className="text-xs text-blue-600 capitalize">{selectedForexPair.category} pair</div>
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
        />
      )}
      
      {!currentStep && completedSteps.includes('h1Confirmation') && (
        <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-6 text-center animate-fadeIn">
          <h2 className="text-xl font-bold text-green-800 mb-3">All Trading Rules Validated!</h2>
          <p className="text-gray-700 mb-2">
            All timeframe validation steps have been completed successfully for <strong>{selectedForexPair?.symbol}</strong> {tradeDirection} setup.
          </p>
          <p className="text-green-700 font-medium mb-4">{getFinalValidationMessage()}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Start New Validation
          </button>
        </div>
      )}
    </div>
  );
};

export default TradingSystem;