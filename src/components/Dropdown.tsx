import React from 'react';
import { Option } from '../types';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  options: Option[];
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedOption,
  onSelect,
  placeholder = 'Select an option'
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (optionId: string) => {
    onSelect(optionId);
    setIsOpen(false);
  };

  const selectedLabel = selectedOption 
    ? options.find(option => option.id === selectedOption)?.label 
    : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`text-sm ${selectedOption ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          {selectedLabel}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.id}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
                selectedOption === option.id 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-medium' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handleSelect(option.id)}
              role="option"
              aria-selected={selectedOption === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;