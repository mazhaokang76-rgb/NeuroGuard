import React, { useState } from 'react';
import Home from './components/Home';
import MMSEAssessment from './components/MMSEAssessment';
import MOCAAssessment from './components/MOCAAssessment';
import ADLAssessment from './components/ADLAssessment';

type ViewType = 'home' | 'MMSE' | 'MOCA' | 'ADL';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleSelectAssessment = (type: ViewType) => {
    setCurrentView(type);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' && (
        <Home onSelectAssessment={handleSelectAssessment} />
      )}
      
      {currentView === 'MMSE' && (
        <MMSEAssessment onComplete={handleBackToHome} onBack={handleBackToHome} />
      )}
      
      {currentView === 'MOCA' && (
        <MOCAAssessment onComplete={handleBackToHome} onBack={handleBackToHome} />
      )}
      
      {currentView === 'ADL' && (
        <ADLAssessment onComplete={handleBackToHome} onBack={handleBackToHome} />
      )}
    </div>
  );
};

export default App;
