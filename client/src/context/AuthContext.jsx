import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services';

const AuthContext = createContext(null);

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
    // Artificial delay so the beautiful loader animation plays
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 2800));

    const storedToken = localStorage.getItem('devarena_token');
    if (!storedToken) {
      minLoadTime.then(() => setLoading(false));
      return;
    }

    // Verify or refresh the current user session once on app mount
    Promise.all([authService.getMe(), minLoadTime])
      .then(([res]) => {
        const userData = res.data?.data?.user;
        if (userData) {
          setUser(userData);
          localStorage.setItem('devarena_user', JSON.stringify(userData));
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        // Only clear session if backend explicitly rejects credentials (401 or 403)
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('devarena_token');
          localStorage.removeItem('devarena_user');
          setToken(null);
          setUser(null);
        } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          toast.error('Backend server is taking longer to respond.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Run ONCE on mount

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { accessToken: newToken, user: userData } = res.data.data;
    localStorage.setItem('devarena_token', newToken);
    localStorage.setItem('devarena_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (credential) => {
    const res = await authService.googleLogin(credential);
    const { accessToken: newToken, user: userData } = res.data.data;
    localStorage.setItem('devarena_token', newToken);
    localStorage.setItem('devarena_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password, role) => {
    const res = await authService.register({ username, email, password, role });
    // Backend doesn't return a token on registration, just success message
    return res.data;
  };

  const logout = () => {
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
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
