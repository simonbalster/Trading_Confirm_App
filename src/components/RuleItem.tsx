import React from 'react';
import { Rule, RuleStatus } from '../types';
import { Check, X, HelpCircle, Circle, Image as ImageIcon, Minus } from 'lucide-react';

interface RuleItemProps {
  rule: Rule;
  ruleStatus: RuleStatus;
  onStatusChange: (ruleId: string, status: RuleStatus) => void;
  isSelected?: boolean;
  singleSelection?: boolean;
}

const RuleItem: React.FC<RuleItemProps> = ({ 
  rule, 
  ruleStatus, 
  onStatusChange, 
  isSelected = false,
  singleSelection = false 
}) => {
  const [showException, setShowException] = React.useState(false);
  const [showImages, setShowImages] = React.useState(false);

  const getButtonStyle = (status: RuleStatus) => {
    if (singleSelection) {
      if (isSelected && status === 'satisfied') {
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 border-2 border-green-400 dark:border-green-500';
      } else if (isSelected) {
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-2 border-blue-400 dark:border-blue-500';
      } else {
        return 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent';
      }
    } else {
      switch (status) {
        case 'satisfied':
          return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50';
        case 'na':
          return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50';
        default:
          return 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600';
      }
    }
  };

  const getIcon = (status: RuleStatus) => {
    if (singleSelection) {
      if (isSelected && status === 'satisfied') {
        return <Check size={16} />;
      } else if (isSelected) {
        return <Circle size={16} className="fill-current" />;
      } else {
        return <Circle size={16} />;
      }
    } else {
      switch (status) {
        case 'satisfied':
          return <Check size={16} />;
        case 'na':
          return <Minus size={16} />;
        default:
          return <X size={16} />;
      }
    }
  };

  const handleMainToggle = () => {
    if (singleSelection) {
      onStatusChange(rule.id, 'satisfied');
    } else {
      // Toggle between satisfied and not_satisfied (ignore na state for main button)
      const newStatus = ruleStatus === 'satisfied' ? 'not_satisfied' : 'satisfied';
      onStatusChange(rule.id, newStatus);
    }
  };

  const handleNAToggle = () => {
    // Toggle between na and not_satisfied
    const newStatus = ruleStatus === 'na' ? 'not_satisfied' : 'na';
    onStatusChange(rule.id, newStatus);
  };

  // Function to render description with proper line breaks
  const renderDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < description.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex flex-col mb-3 border rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md ${
      singleSelection && isSelected ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 
      ruleStatus === 'na' ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <div className="flex items-center mr-3">
            <button
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${getButtonStyle(ruleStatus)} ${
                ruleStatus === 'na' ? 'opacity-50' : ''
              }`}
              onClick={handleMainToggle}
              disabled={ruleStatus === 'na'}
              aria-label={
                singleSelection 
                  ? (isSelected ? "Rule is selected" : "Select this rule")
                  : (ruleStatus === 'satisfied' ? "Rule is satisfied" : "Rule is not satisfied")
              }
            >
              {getIcon(ruleStatus)}
            </button>
            
            {rule.allowNA && !singleSelection && (
              <button
                className={`ml-2 px-2 py-1 text-xs rounded-md transition-all duration-200 font-medium ${
                  ruleStatus === 'na' 
                    ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 shadow-sm' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400'
                }`}
                onClick={handleNAToggle}
                aria-label={ruleStatus === 'na' ? "Remove Exception status" : "Mark as Exception"}
              >
                EXCP
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <p className={`font-medium ${
              singleSelection && isSelected ? 'text-blue-800 dark:text-blue-200' : 
              ruleStatus === 'na' ? 'text-green-700 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'
            }`}>
              {renderDescription(rule.description)}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {rule.exceptions && rule.exceptions.length > 0 && (
                <button
                  onClick={() => setShowException(!showException)}
                  className="text-blue-600 dark:text-blue-400 text-xs flex items-center hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <HelpCircle size={12} className="mr-1" />
                  {showException ? 'Hide exception' : 'Show exception'}
                </button>
              )}
              
              {rule.images && rule.images.length > 0 && (
                <button
                  onClick={() => setShowImages(!showImages)}
                  className="text-purple-600 dark:text-purple-400 text-xs flex items-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  <ImageIcon size={12} className="mr-1" />
                  {showImages ? 'Hide examples' : `Show examples (${rule.images.length})`}
                </button>
              )}
            </div>

            {showException && rule.exceptions && (
              <div className="mt-2 pl-4 border-l-2 border-blue-200 dark:border-blue-600 text-xs text-gray-600 dark:text-gray-400">
                {rule.exceptions.map((exception, index) => (
                  <p key={index} className={`mb-1 ${
                    exception === 'NO EXCEPTION' ? 'font-bold text-red-600 dark:text-red-400' : ''
                  }`}>
                    Exception: {exception}
                  </p>
                ))}
              </div>
            )}

            {showImages && rule.images && rule.images.length > 0 && (
              <div className="mt-3 space-y-3">
                {rule.images.map((image, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.alt || `Example ${index + 1} for ${rule.description}`}
                      className="w-full h-auto max-h-64 object-contain bg-gray-50 dark:bg-gray-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'p-4 text-center text-gray-500 dark:text-gray-400 text-sm';
                        errorDiv.textContent = 'Image not available';
                        target.parentNode?.appendChild(errorDiv);
                      }}
                    />
                    {image.alt && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
                        {image.alt}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleItem;