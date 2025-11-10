import { useState } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log("Authentication successful!");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log("Logging out operative...");
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
  };
};
