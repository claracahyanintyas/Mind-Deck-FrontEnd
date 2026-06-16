import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import api, { setLogoutHandler } from '../Api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // 1. Try to fetch the profile using the access token cookie
        const response = await api.get('/users/me'); 
        setUser(response.data);
      } catch (error) {
        console.log("Access token expired. Attempting silent token rotation...");
        try {
          // 2. Try to silently rotate tokens if a refresh cookie exists
          await api.post('/auth/refresh'); 
          
          const refreshedUserResponse = await api.get('/users/me');
          setUser(refreshedUserResponse.data);
        } catch (refreshError) {
          // 3. ABSOLUTE COLD START (No valid tokens at all for USER or GUEST)
          console.log("No valid active session found. Leaving as unauthenticated visitor.");
          setUser(null); 
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Login handler
  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      setUser(response.data); // Update state with the UserPublicData DTO
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await AuthService.logout(); // Tells backend to destroy the HttpOnly cookie wrapper
    } catch (error) {
      console.error("Backend failed to clear cookie safely:", error);
    } finally {
      setUser(null); // Instantly boot them out of the UI dashboard
    }
  };

  // Wire up the global interceptor hook
  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

const isAuthenticated = !!user && user.email !== "" && !user.roles?.includes("ROLE_GUEST");

const loginAsGuest = async () => {
  try {
    setLoading(true);
    await AuthService.guest(); // Calls your POST /guest endpoint
    const guestResponse = await api.get('/users/me');
    setUser(guestResponse.data);
    return guestResponse.data;
  } catch (error) {
    console.error("Failed to initialize guest session:", error);
    toast.error("Could not create guest session.");
  } finally {
    setLoading(false);
  }
};

// Make sure to expose it in your Provider value:
return (
  <AuthContext.Provider value={{ user, login, logout, loginAsGuest, isAuthenticated, loading }}>
    {!loading && children}
  </AuthContext.Provider>
);
};

export default AuthProvider;