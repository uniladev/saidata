// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, getAccessToken } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // Login function
  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    
    // Backend returns: { success: true, token: "...", user: {...} }
    if (data.success && data.token) {
      setAccessToken(data.token);
      setUser(data.user || null);
      
      // Store user in localStorage for quick reload
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data.user;
    }
    
    throw new Error(data.message || 'Login failed');
  };

  // Logout function
  const logout = async () => {
    try { 
      await api.post("/auth/logout");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // Refresh token
  const refresh = async () => {
    const { data } = await api.post("/auth/refresh", {});
    
    // Backend returns: { success: true, token: "..." }
    if (data.success && data.token) {
      setAccessToken(data.token);
      return data.token;
    }
    
    throw new Error('Token refresh failed');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!getAccessToken();
  };

  // Bootstrap: check token and restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const token = getAccessToken();
        
        if (!token) {
          // No token, not logged in
          setBooting(false);
          return;
        }

        // Try to get user info from localStorage first (faster)
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (e) {
            localStorage.removeItem('user');
          }
        }

        // Verify token is still valid and get fresh user data
        const { data } = await api.get("/auth/me");
        
        // Backend returns: { success: true, data: { id, name, email, role } }
        if (data.success && data.data) {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        } else {
          // Token invalid, try to refresh
          await refresh();
          const retryData = await api.get("/auth/me");
          if (retryData.data.success && retryData.data.data) {
            setUser(retryData.data.data);
            localStorage.setItem('user', JSON.stringify(retryData.data.data));
          }
        }
      } catch (error) {
        console.error('Session restore failed:', error);
        // Clear everything if restoration fails
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const value = {
    user,
    booting,
    login,
    logout,
    isAuthenticated,
    refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {!booting && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};