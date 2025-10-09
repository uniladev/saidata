// src/components/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../../config/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user || null);
    return data.user;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    setAccessToken(null);
    setUser(null);
  };

  const refresh = async () => {
    const { data } = await api.post("/auth/refresh", {});
    setAccessToken(data.accessToken);
    return data.accessToken;
  };

  // Bootstrap: try refresh, then /auth/me (optional)
  useEffect(() => {
    (async () => {
      try {
        await refresh();
        const { data } = await api.get("/auth/me");
        setUser(data.user || null);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const value = { user, booting, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
