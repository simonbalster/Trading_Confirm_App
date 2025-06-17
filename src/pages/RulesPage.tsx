import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import steps from '../data/steps';
import { TradeDirection } from '../types';
import RuleDisplay from '../components/RuleDisplay';

interface RulesPageProps {
  stepId: string;
  onBack: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({ stepId, onBack, isDarkMode, toggleDarkMode }) => {
  const step = steps[stepId];

  if (!step) {
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

  const hasStaticRules = step.rules && step.rules.length > 0;
  const hasDynamicRules = step.getRules && typeof step.getRules === 'function';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Validation
          </button>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{step.title} Rules</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">{step.description}</p>
          </div>
        </div>

        {hasStaticRules && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">General Rules</h2>
              <ul className="space-y-0">
                {step.rules.map((rule, index) => (
                  <RuleDisplay key={rule.id} rule={rule} ruleIndex={index} />
                ))}
              </ul>
            </div>
          </div>
        )}

        {hasDynamicRules && (
          <div className="space-y-8">
            {step.options.map((option) => (
              <div key={option.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{option.label}</h2>
                
                {/* Show rules for both trade directions if applicable */}
                {(['buy', 'sell'] as TradeDirection[]).map((direction) => {
                  const rules = step.getRules!(option.id, direction);
                  
                  if (rules.length === 0) return null;
                  
                  // Check if rules are different for buy vs sell
                  const buyRules = step.getRules!(option.id, 'buy');
                  const sellRules = step.getRules!(option.id, 'sell');
                  const rulesAreDifferent = JSON.stringify(buyRules) !== JSON.stringify(sellRules);
                  
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
                      
                      {/* Only show one set of rules if they're the same for both directions */}
                      {!rulesAreDifferent && direction === 'buy'} 
                      {rulesAreDifferent && direction === 'sell' && <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6"></div>}
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