import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services';

const AuthContext = createContext(null);

/**
 * ARCHITECTURAL ROADMAP NOTE (Phase 5 Hardening):
 * Storing the access token in localStorage exposes it to potential exfiltration if an XSS
 * flaw exists. The recommended follow-up architecture is to store the access token strictly
 * in memory (React State / closure), bootstrapping the session on page refresh via the httpOnly
 * refreshToken cookie (POST /api/auth/refresh).
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('devarena_token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('devarena_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('devarena_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Verify or refresh the current user session once on app mount
    authService.getMe()
      .then((res) => {
        const userData = res.data?.data?.user;
        if (userData) {
          setUser(userData);
          localStorage.setItem('devarena_user', JSON.stringify(userData));
        }
      })
      .catch((err) => {
        console.error('Auth check failed:', err);
        // Clear session if backend explicitly rejects credentials
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('devarena_token');
          localStorage.removeItem('devarena_user');
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Run ONCE on mount

  const login = async (email, password) => {
    // Call the real backend — no client-side fallback sessions.
    // If the request fails, propagate the error so the UI can display it.
    const res = await authService.login({ email, password });
    const { accessToken: newToken, user: userData } = res.data.data;
    localStorage.setItem('devarena_token', newToken);
    localStorage.setItem('devarena_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (credentialOrParams) => {
    // Call the real backend — no client-side fallback sessions.
    const payload = typeof credentialOrParams === 'string'
      ? { credential: credentialOrParams }
      : credentialOrParams;
    const res = await authService.googleLogin(payload);
    const { accessToken: newToken, user: userData } = res.data.data;
    localStorage.setItem('devarena_token', newToken);
    localStorage.setItem('devarena_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password, role) => {
    const res = await authService.register({ username, email, password, role });
    // Backend doesn't return a token on registration, just a success message
    return res.data;
  };

  const logout = () => {
    authService.logout().catch(() => {});
    localStorage.removeItem('devarena_token');
    localStorage.removeItem('devarena_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('devarena_user', JSON.stringify(updated));
      } catch (e) { /* quota exceeded — non-critical */ }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
