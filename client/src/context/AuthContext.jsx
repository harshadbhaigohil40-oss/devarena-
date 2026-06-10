import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('devarena_token'));

  useEffect(() => {
    if (token) {
      authService.getMe()
        .then(res => {
          setUser(res.data.data.user);
        })
        .catch(() => {
          localStorage.removeItem('devarena_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { accessToken: newToken, user: userData } = res.data.data;
    localStorage.setItem('devarena_token', newToken);
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
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
