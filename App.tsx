import React, { useState } from 'react';
import Home from './components/Home';
import MMSEAssessment from './components/MMSEAssessment';
import MOCAAssessment from './components/MOCAAssessment';
import ADLAssessment from './components/ADLAssessment';

console.log('App component loaded');

type ViewType = 'home' | 'MMSE' | 'MOCA' | 'ADL';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  console.log('Current view:', currentView);

  const handleSelectAssessment = (type: ViewType) => {
    console.log('Switching to view:', type);
    setCurrentView(type);
  };

  const handleBackToHome = () => {
    console.log('Returning to home');
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
}

export default App;
