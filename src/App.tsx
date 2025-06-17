import React from 'react';
import Header from './components/Header';
import TradingSystem from './components/TradingSystem';
import RulesPage from './pages/RulesPage';

type AppView = 'validation' | 'rules';

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Check localStorage for saved preference, default to false
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentView, setCurrentView] = React.useState<AppView>('validation');
  const [activeRulesTab, setActiveRulesTab] = React.useState<string>('h4Initial');

  React.useEffect(() => {
    // Apply dark class to document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleViewAllRules = () => {
    setActiveRulesTab('h4Initial');
    setCurrentView('rules');
  };

  const navigateToValidation = () => {
    setCurrentView('validation');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onViewAllRules={handleViewAllRules}
      />
      
      {currentView === 'validation' ? (
        <TradingSystem 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <RulesPage 
          initialTab={activeRulesTab}
          onBack={navigateToValidation}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}

export default App;