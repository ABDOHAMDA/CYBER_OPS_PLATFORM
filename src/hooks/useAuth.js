import { useState } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    console.log("Authentication successful!", userData);
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleRegister = (userData) => {
    console.log("Registration successful!", userData);
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    console.log("Logging out operative...");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return {
    isLoggedIn,
    currentUser,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
