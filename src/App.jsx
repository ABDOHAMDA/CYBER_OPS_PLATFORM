import React, { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import Navbar from './components/layout/Navbar';
import HomePage from './components/pages/HomePage';
import Dashboard from './components/pages/Dashboard';
import TrainingSelectionPage from './components/pages/TrainingSelectionPage';
import LabsPage from './components/pages/LabsPage';
import LabDetailPage from './components/pages/LabDetailPage';
import ChallengePage from './components/pages/ChallengePage';
import CommentsPage from './components/pages/CommentsPage';
import { useAuth } from './hooks/useAuth';
import { useLabs } from './hooks/useLabs';
import './styles/animations.css';

function App() {
  const { isLoggedIn, currentUser, handleLogin, handleRegister, handleLogout } = useAuth();
  const { selectedLabType, setSelectedLabType, selectedLab, selectedChallenge } = useLabs();
  const [currentPage, setCurrentPage] = useState('login');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const renderAuthPage = () => {
    if (authMode === 'login') {
      return (
        <LoginPage 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setAuthMode('register')} 
        />
      );
    } else {
      return (
        <RegisterPage 
          onRegister={handleRegister} 
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      );
    }
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'training':
        return <TrainingSelectionPage setCurrentPage={setCurrentPage} setSelectedLabType={setSelectedLabType} />;
      case 'labs':
        return <LabsPage setCurrentPage={setCurrentPage} selectedLabType={selectedLabType} />;
      case 'lab-detail':
        return <LabDetailPage setCurrentPage={setCurrentPage} />;
      case 'challenge':
        return <ChallengePage setCurrentPage={setCurrentPage} />;
      case 'comments':
        return <CommentsPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      {!isLoggedIn ? (
        renderAuthPage()
      ) : (
        <>
          <Navbar
            setCurrentPage={setCurrentPage}
            onLogout={handleLogout}
            currentPage={currentPage}
            currentUser={currentUser}
          />
          {renderPage()}
        </>
      )}
    </div>
  );
}

export default App;