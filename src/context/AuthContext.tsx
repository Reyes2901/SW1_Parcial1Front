// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  setAuthToken,
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  getPerfil as apiGetPerfil,
  updatePerfil as apiUpdatePerfil,
} from "../api/auth";

type User = {
  id?: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must usarse dentro de AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Init: si hay token en localStorage, setear header y refrescar perfil
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setAuthToken(storedToken);
          setToken(storedToken);
          try {
            const perfil = await apiGetPerfil();
            if (!mounted) return;
            setUser(perfil);
            localStorage.setItem("user", JSON.stringify(perfil));
          } catch (err) {
            // token inválido -> limpiar
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuthToken(null);
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (username: string, password: string) => {
    const res = await apiLogin(username, password); // { token, user }
    const t = res.token;
    const u = res.user;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setAuthToken(t);
    setToken(t);
    setUser(u);
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    const res = await apiRegister(data);
    const t = res.token;
    const u = res.user;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setAuthToken(t);
    setToken(t);
    setUser(u);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthToken(null);
      setToken(null);
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    const perfil = await apiGetPerfil();
    setUser(perfil);
    localStorage.setItem("user", JSON.stringify(perfil));
  };

  const updateProfile = async (payload: Partial<User>) => {
    const updated = await apiUpdatePerfil(payload);
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
