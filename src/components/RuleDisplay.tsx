import React from 'react';
import { Rule } from '../types';
import { HelpCircle, ImageIcon } from 'lucide-react';

interface RuleDisplayProps {
  rule: Rule;
  ruleIndex: number;
}

const RuleDisplay: React.FC<RuleDisplayProps> = ({ rule, ruleIndex }) => {
  const [showException, setShowException] = React.useState(false);
  const [showImages, setShowImages] = React.useState(false);

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
    <li className="mb-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="flex items-start">
        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
          {ruleIndex + 1}
        </span>
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
            {renderDescription(rule.description)}
          </p>
          
          {rule.allowNA && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                N/A Allowed
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {rule.exceptions && rule.exceptions.length > 0 && (
              <button
                onClick={() => setShowException(!showException)}
                className="text-blue-600 dark:text-blue-400 text-sm flex items-center hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <HelpCircle size={14} className="mr-1" />
                {showException ? 'Hide exceptions' : `Show exceptions (${rule.exceptions.length})`}
              </button>
            )}
            
            {rule.images && rule.images.length > 0 && (
              <button
                onClick={() => setShowImages(!showImages)}
                className="text-purple-600 dark:text-purple-400 text-sm flex items-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
              >
                <ImageIcon size={14} className="mr-1" />
                {showImages ? 'Hide examples' : `Show examples (${rule.images.length})`}
              </button>
            )}
          </div>

          {showException && rule.exceptions && (
            <div className="mt-3 pl-4 border-l-2 border-blue-200 dark:border-blue-600">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Exceptions:</h4>
              <ul className="space-y-1">
                {rule.exceptions.map((exception, index) => (
                  <li key={index} className={`text-sm ${
                    exception === 'NO EXCEPTION' 
                      ? 'font-bold text-red-600 dark:text-red-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    • {exception}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showImages && rule.images && rule.images.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">Examples:</h4>
              {rule.images.map((image, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt || `Example ${index + 1} for rule ${ruleIndex + 1}`}
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
    </li>
  );
};

export default RuleDisplay;