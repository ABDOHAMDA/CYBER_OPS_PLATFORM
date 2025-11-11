import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import EmailVerificationPage from './components/auth/EmailVerificationPage';
import SetPasswordPage from './components/auth/SetPasswordPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
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

// Main App Component with Router
function AppContent() {
  const { isLoggedIn, currentUser, handleLogin, handleRegister, handleLogout } = useAuth();
  const { selectedLabType, setSelectedLabType, selectedLab, selectedChallenge } = useLabs();
  const navigate = useNavigate();
  const location = useLocation();

  const [authMode, setAuthMode] = useState('login');
  const [pendingUser, setPendingUser] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Sync URL with auth mode
  useEffect(() => {
    const path = location.pathname;
    if (path === '/register') setAuthMode('register');
    else if (path === '/verify') setAuthMode('verification');
    else if (path === '/set-password') setAuthMode('setPassword');
    else if (path === '/forgot-password') setAuthMode('forgotPassword');
    else setAuthMode('login');
  }, [location]);

  const handleRegisterStart = (userData) => {
    setPendingUser(userData);
    setVerificationEmail(userData.email);
    navigate('/verify');
  };

  const handleVerificationComplete = () => {
    navigate('/set-password');
  };

  const handleResendCode = () => {
    console.log('Resending verification code to:', verificationEmail);
  };

  const handlePasswordSet = (password) => {
    console.log('Password set for user:', pendingUser);
    const completeUser = {
      ...pendingUser,
      password: password,
      profile_meta: {
        ...pendingUser.profile_meta,
        is_verified: true,
        verification_date: new Date().toISOString()
      }
    };
    handleRegister(completeUser);
    navigate('/');
    setPendingUser(null);
  };

  const handleBackToVerification = () => {
    navigate('/verify');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleResetSent = (email) => {
    console.log('Password reset instructions sent to:', email);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleLoginSuccess = (userData) => {
    handleLogin(userData);
    navigate('/home');
  };

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  const handleLogoutWithNavigation = () => {
    handleLogout();
    navigate('/');
  };

  // Render auth pages based on route
  const renderAuthPage = () => {
    switch(authMode) {
      case 'login':
        return (
          <LoginPage 
            onLogin={handleLoginSuccess} 
            onSwitchToRegister={() => navigate('/register')}
            onForgotPassword={handleForgotPassword}
          />
        );
      case 'register':
        return (
          <RegisterPage 
            onRegister={handleRegisterStart} 
            onSwitchToLogin={() => navigate('/')} 
          />
        );
      case 'verification':
        return (
          <EmailVerificationPage
            email={verificationEmail}
            onVerificationComplete={handleVerificationComplete}
            onResendCode={handleResendCode}
          />
        );
      case 'setPassword':
        return (
          <SetPasswordPage
            email={verificationEmail}
            onPasswordSet={handlePasswordSet}
            onBackToVerification={handleBackToVerification}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordPage
            onBackToLogin={handleBackToLogin}
            onResetSent={handleResetSent}
          />
        );
      default:
        return (
          <LoginPage 
            onLogin={handleLoginSuccess} 
            onSwitchToRegister={() => navigate('/register')}
            onForgotPassword={handleForgotPassword}
          />
        );
    }
  };

  // Render main app pages
  const renderPage = () => {
    const path = location.pathname;
    
    if (path === '/home' || path === '/') {
      return <HomePage setCurrentPage={handleNavigation} />;
    } else if (path === '/dashboard') {
      return <Dashboard />;
    } else if (path === '/training') {
      return <TrainingSelectionPage setCurrentPage={handleNavigation} setSelectedLabType={setSelectedLabType} />;
    } else if (path === '/labs') {
      return <LabsPage setCurrentPage={handleNavigation} selectedLabType={selectedLabType} />;
    } else if (path === '/lab-detail') {
      return <LabDetailPage setCurrentPage={handleNavigation} />;
    } else if (path === '/challenge') {
      return <ChallengePage setCurrentPage={handleNavigation} />;
    } else if (path === '/comments') {
      return <CommentsPage />;
    } else {
      return <HomePage setCurrentPage={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen">
      {!isLoggedIn ? (
        renderAuthPage()
      ) : (
        <>
          <Navbar
            setCurrentPage={handleNavigation}
            onLogout={handleLogoutWithNavigation}
            currentPage={location.pathname.replace('/', '') || 'home'}
            currentUser={currentUser}
          />
          {renderPage()}
        </>
      )}
    </div>
  );
}

// Router Wrapper
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;