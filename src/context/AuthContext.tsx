import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as loginRequest } from '../services/authApi';
import type { AuthUser } from '../types/auth';

const STORAGE_KEY = 'bhopal-auth-user';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const login = useCallback(async (userName: string, password: string) => {
    const response = await loginRequest({ userName, password });
    if (!response.isSuccess) {
      throw new Error(
        response.errorMessage || 'Invalid username or password',
      );
    }
    const nextUser: AuthUser = {
      loggedInID: response.loggedInID,
      loggedInName: response.loggedInName,
      companyID: response.companyID,
      companyName: response.companyName,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
