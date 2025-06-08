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
        return 'bg-green-100 text-green-600 hover:bg-green-200 border-2 border-green-400';
      } else if (isSelected) {
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-2 border-blue-400';
      } else {
        return 'bg-gray-100 text-gray-400 hover:bg-gray-200 border-2 border-transparent';
      }
    } else {
      switch (status) {
        case 'satisfied':
          return 'bg-green-100 text-green-600 hover:bg-green-200';
        case 'na':
          return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
        default:
          return 'bg-gray-100 text-gray-400 hover:bg-gray-200';
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

  return (
    <div className={`flex flex-col mb-3 border rounded-lg p-3 bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
      singleSelection && isSelected ? 'border-blue-300 bg-blue-50' : 
      ruleStatus === 'na' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
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
                className={`ml-2 px-2 py-1 text-xs rounded-md transition-all duration-200 ${
                  ruleStatus === 'na' 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                }`}
                onClick={handleNAToggle}
                aria-label={ruleStatus === 'na' ? "Remove N/A status" : "Mark as Not Applicable"}
              >
                N/A
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <p className={`font-medium ${
              singleSelection && isSelected ? 'text-blue-800' : 
              ruleStatus === 'na' ? 'text-blue-700' : 'text-gray-800'
            }`}>
              {rule.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {rule.exceptions && rule.exceptions.length > 0 && (
                <button
                  onClick={() => setShowException(!showException)}
                  className="text-blue-600 text-xs flex items-center hover:text-blue-800 transition-colors"
                >
                  <HelpCircle size={12} className="mr-1" />
                  {showException ? 'Hide exception' : 'Show exception'}
                </button>
              )}
              
              {rule.images && rule.images.length > 0 && (
                <button
                  onClick={() => setShowImages(!showImages)}
                  className="text-purple-600 text-xs flex items-center hover:text-purple-800 transition-colors"
                >
                  <ImageIcon size={12} className="mr-1" />
                  {showImages ? 'Hide examples' : `Show examples (${rule.images.length})`}
                </button>
              )}
            </div>

            {showException && rule.exceptions && (
              <div className="mt-2 pl-4 border-l-2 border-blue-200 text-xs text-gray-600">
                {rule.exceptions.map((exception, index) => (
                  <p key={index} className={`mb-1 ${
                    exception === 'NO EXCEPTION' ? 'font-bold text-red-600' : ''
                  }`}>
                    Exception: {exception}
                  </p>
                ))}
              </div>
            )}

            {showImages && rule.images && rule.images.length > 0 && (
              <div className="mt-3 space-y-3">
                {rule.images.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.alt || `Example ${index + 1} for ${rule.description}`}
                      className="w-full h-auto max-h-64 object-contain bg-gray-50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'p-4 text-center text-gray-500 text-sm';
                        errorDiv.textContent = 'Image not available';
                        target.parentNode?.appendChild(errorDiv);
                      }}
                    />
                    {image.alt && (
                      <div className="p-2 bg-gray-50 text-xs text-gray-600 border-t">
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