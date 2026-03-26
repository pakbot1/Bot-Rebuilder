import { useState, useEffect } from "react";

export function useAuth() {
  const [apiKey, setApiKeyState] = useState(() => {
    return localStorage.getItem("pakbot_api_key") || "";
  });
  
  const [adminKey, setAdminKeyState] = useState(() => {
    return localStorage.getItem("pakbot_admin_key") || "";
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem("pakbot_api_key", key);
  };

  const setAdminKey = (key: string) => {
    setAdminKeyState(key);
    localStorage.setItem("pakbot_admin_key", key);
  };

  const logoutAdmin = () => {
    setAdminKeyState("");
    localStorage.removeItem("pakbot_admin_key");
  };

  const logoutDeveloper = () => {
    setApiKeyState("");
    localStorage.removeItem("pakbot_api_key");
  };

  return { 
    apiKey, 
    setApiKey, 
    adminKey, 
    setAdminKey,
    logoutAdmin,
    logoutDeveloper
  };
}
