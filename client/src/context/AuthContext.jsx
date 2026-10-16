import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService, setAccessToken, onTokenChange } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('devarena_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const updateToken = (newToken) => {
    setAccessToken(newToken);
    setTokenState(newToken);
  };

  useEffect(() => {
    // Listen to token changes from axios interceptors
    const unsubscribe = onTokenChange((newToken) => {
      setTokenState(newToken);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Remove any legacy token from localStorage
    localStorage.removeItem('devarena_token');

    // Bootstrap session on app mount via httpOnly refreshToken cookie
    authService.refreshToken()
      .then(async (res) => {
        const newToken = res.data?.data?.accessToken;
        if (newToken) {
          updateToken(newToken);
          try {
            const userRes = await authService.getMe();
            const userData = userRes.data?.data?.user;
            if (userData) {
              setUser(userData);
              localStorage.setItem('devarena_user', JSON.stringify(userData));
            }
          } catch (e) {
            // Non-critical if getMe fails
          }
        }
      })
      .catch(() => {
        updateToken(null);
        setUser(null);
        localStorage.removeItem('devarena_user');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Run ONCE on mount

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { accessToken: newToken, user: userData } = res.data.data;
    updateToken(newToken);
    localStorage.setItem('devarena_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (credentialOrParams) => {
    const payload = typeof credentialOrParams === 'string'
      ? { credential: credentialOrParams }
      : credentialOrParams;
    const res = await authService.googleLogin(payload);
    const { accessToken: newToken, user: userData } = res.data.data;
    updateToken(newToken);
    localStorage.setItem('devarena_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password, role) => {
    const res = await authService.register({ username, email, password, role });
    return res.data;
  };

  const logout = () => {
    authService.logout().catch(() => {});
    updateToken(null);
    localStorage.removeItem('devarena_user');
    localStorage.removeItem('devarena_token');
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
