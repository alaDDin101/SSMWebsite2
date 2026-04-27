import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { TokenResponseDto } from "@/types/api";

interface AuthState {
  user: { userId: string; email: string; roles: string[] } | null;
  isAuthenticated: boolean;
  login: (token: TokenResponseDto) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthState["user"]>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const userData = sessionStorage.getItem("userData");
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        const expiresAt = sessionStorage.getItem("expiresAt");
        if (expiresAt && new Date(expiresAt) > new Date()) {
          setUser(parsed);
        } else {
          sessionStorage.clear();
        }
      } catch {
        sessionStorage.clear();
      }
    }
  }, []);

  const login = useCallback((token: TokenResponseDto) => {
    const raw = token as TokenResponseDto & {
      AccessToken?: string;
      ExpiresAt?: string;
      UserId?: string;
      Email?: string | null;
      Roles?: string[];
    };
    const accessToken = raw.accessToken ?? raw.AccessToken ?? "";
    const expiresAt = raw.expiresAt ?? raw.ExpiresAt ?? "";
    const userId = raw.userId ?? raw.UserId ?? "";
    const email = raw.email ?? raw.Email ?? "";
    const roles = raw.roles ?? raw.Roles ?? [];

    if (!accessToken || !expiresAt || !userId) {
      throw new Error("تعذر إكمال تسجيل الدخول بسبب استجابة غير صالحة من الخادم.");
    }

    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("expiresAt", typeof expiresAt === "string" ? expiresAt : String(expiresAt));
    const ud = { userId: String(userId), email, roles };
    sessionStorage.setItem("userData", JSON.stringify(ud));
    setUser(ud);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
