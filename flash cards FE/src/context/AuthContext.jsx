import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import api, { setLogoutHandler } from '../Api';

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
        // 2. Access token failed! Let's try to silently refresh the tokens
        console.log("Access token expired. Attempting silent token rotation...");
        try {
          // Hit your backend refresh endpoint. 
          // The browser automatically attaches the long-lived refresh cookie if it exists!
          await api.post('/auth/refresh'); 
          
          // If refresh succeeds, we have a fresh access token cookie! Fetch the user profile now.
          const refreshedUserResponse = await api.get('/users/me');
          setUser(refreshedUserResponse.data);
        } catch (refreshError) {
          // 3. Refresh token failed or doesn't exist (Brand new visitor!)
          console.log("No valid refresh token found. Initializing brand new anonymous guest row...");
          try {
            await AuthService.guest();
            const guestResponse = await api.get('/users/me');
            setUser(guestResponse.data);
          } catch (guestError) {
            console.error("Critical failure establishing guest environment:", guestError);
            setUser(null);
          }
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;