import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import steps from '../data/steps';
import { TradeDirection } from '../types';
import RuleDisplay from '../components/RuleDisplay';
import Dropdown from '../components/Dropdown';

interface RulesPageProps {
  initialTab: string;
  onBack: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({ initialTab, onBack, isDarkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [selectedOptionForTab, setSelectedOptionForTab] = React.useState<string | null>(null);

  const tabs = [
    { id: 'h4Initial', label: 'H4 Rules', description: 'H4 Candle Validation Rules' },
    { id: 'dailyRules', label: 'Daily Rules', description: 'Daily Timeframe Rules' },
    { id: 'h1Confirmation', label: 'H1 Rules', description: 'H1 Confirmation Rules' }
  ];

  // Initialize selectedOptionForTab when activeTab changes for H4 and H1 tabs
  React.useEffect(() => {
    if (activeTab === 'h4Initial' || activeTab === 'h1Confirmation') {
      const activeStep = steps[activeTab];
      if (activeStep && activeStep.options && activeStep.options.length > 0) {
        setSelectedOptionForTab(activeStep.options[0].id);
      } else {
        setSelectedOptionForTab(null);
      }
    } else {
      setSelectedOptionForTab(null);
    }
  }, [activeTab]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionForTab(optionId);
  };

  const activeStep = steps[activeTab];

  if (!activeStep) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Validation
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Step Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300">The requested step could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const hasStaticRules = activeStep.rules && activeStep.rules.length > 0;
  const hasDynamicRules = activeStep.getRules && typeof activeStep.getRules === 'function';

  // Get options for iteration - handle dynamic options for dailyRules
  let optionsForIteration = activeStep.options;
  if (activeStep.getOptions && activeTab === 'dailyRules') {
    optionsForIteration = activeStep.getOptions(null, 'buy', {});
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Validation
          </button>
          
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs mt-1 opacity-75">{tab.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{activeStep.title} Rules</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">{activeStep.description}</p>
          </div>
        </div>

        {hasStaticRules && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">General Rules</h2>
              <ul className="space-y-0">
                {activeStep.rules.map((rule, index) => (
                  <RuleDisplay key={rule.id} rule={rule} ruleIndex={index} />
                ))}
              </ul>
            </div>
          </div>
        )}

        {hasDynamicRules && (
          <div className="space-y-8">
            {/* Show dropdown for H4 and H1 tabs */}
            {(activeTab === 'h4Initial' || activeTab === 'h1Confirmation') && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Option to View Rules
                  </label>
                  <Dropdown
                    options={activeStep.options}
                    selectedOption={selectedOptionForTab}
                    onSelect={handleOptionSelect}
                    placeholder="Choose an option..."
                  />
                </div>

                {selectedOptionForTab && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                      {activeStep.options.find(opt => opt.id === selectedOptionForTab)?.label} Rules
                    </h2>
                    
                    {/* Show rules for both trade directions if applicable */}
                    {(['buy', 'sell'] as TradeDirection[]).map((direction) => {
                      const rules = activeStep.getRules!(selectedOptionForTab, direction);
                      
                      if (rules.length === 0) return null;
                      
                      // Check if rules are different for buy vs sell
                      const buyRules = activeStep.getRules!(selectedOptionForTab, 'buy');
                      const sellRules = activeStep.getRules!(selectedOptionForTab, 'sell');
                      const rulesAreDifferent = JSON.stringify(buyRules) !== JSON.stringify(sellRules);
                      
                      // Prevent duplication: if rules are the same and this is 'sell', skip rendering
                      if (!rulesAreDifferent && direction === 'sell') {
                        return null;
                      }
                      
                      return (
                        <div key={`${selectedOptionForTab}-${direction}`} className="mb-6 last:mb-0">
                          {rulesAreDifferent && (
                            <div className="flex items-center mb-3">
                              {direction === 'buy' ? (
                                <TrendingUp size={18} className="text-green-600 dark:text-green-400 mr-2" />
                              ) : (
                                <TrendingDown size={18} className="text-red-600 dark:text-red-400 mr-2" />
                              )}
                              <h3 className={`text-lg font-semibold ${
                                direction === 'buy' 
                                  ? 'text-green-800 dark:text-green-200' 
                                  : 'text-red-800 dark:text-red-200'
                              }`}>
                                {direction.charAt(0).toUpperCase() + direction.slice(1)} Setup Rules
                              </h3>
                            </div>
                          )}
                          
                          <ul className="space-y-0">
                            {rules.map((rule, index) => (
                              <RuleDisplay key={`${rule.id}-${direction}`} rule={rule} ruleIndex={index} />
                            ))}
                          </ul>
                          
                          {rulesAreDifferent && direction === 'buy' && <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6"></div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Show all options for Daily Rules tab (preserve existing behavior) */}
            {activeTab === 'dailyRules' && optionsForIteration.map((option) => (
              <div key={option.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{option.label}</h2>
                
                {/* Show rules for both trade directions if applicable */}
                {(['buy', 'sell'] as TradeDirection[]).map((direction) => {
                  const rules = activeStep.getRules!(option.id, direction);
                  
                  if (rules.length === 0) return null;
                  
                  // Check if rules are different for buy vs sell
                  const buyRules = activeStep.getRules!(option.id, 'buy');
                  const sellRules = activeStep.getRules!(option.id, 'sell');
                  const rulesAreDifferent = JSON.stringify(buyRules) !== JSON.stringify(sellRules);
                  
                  // Prevent duplication: if rules are the same and this is 'sell', skip rendering
                  if (!rulesAreDifferent && direction === 'sell') {
                    return null;
                  }
                  
                  return (
                    <div key={`${option.id}-${direction}`} className="mb-6 last:mb-0">
                      {rulesAreDifferent && (
                        <div className="flex items-center mb-3">
                          {direction === 'buy' ? (
                            <TrendingUp size={18} className="text-green-600 dark:text-green-400 mr-2" />
                          ) : (
                            <TrendingDown size={18} className="text-red-600 dark:text-red-400 mr-2" />
                          )}
                          <h3 className={`text-lg font-semibold ${
                            direction === 'buy' 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-red-800 dark:text-red-200'
                          }`}>
                            {direction.charAt(0).toUpperCase() + direction.slice(1)} Setup Rules
                          </h3>
                        </div>
                      )}
                      
                      <ul className="space-y-0">
                        {rules.map((rule, index) => (
                          <RuleDisplay key={`${rule.id}-${direction}`} rule={rule} ruleIndex={index} />
                        ))}
                      </ul>
                      
                      {rulesAreDifferent && direction === 'buy' && <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6"></div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {!hasStaticRules && !hasDynamicRules && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">No rules defined for this step.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RulesPage;