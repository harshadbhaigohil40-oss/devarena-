import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user) return;

    const currentToken = token || localStorage.getItem('devarena_token');
    if (!currentToken) return;

    const getSocketUrl = () => {
      const envUrl = import.meta.env.VITE_API_BASE_URL;
      if (envUrl) {
        return envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
      }
      return import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin;
    };

    const newSocket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
      auth: {
        token: currentToken,
      },
    });

    newSocket.on('xp:gained', ({ amount, source }) => {
      toast.success(`+${amount} XP from ${source}!`, {
        icon: '⚡',
        style: { background: '#1a1a2e', color: '#fdcb6e', border: '1px solid #2a2a3e' },
      });
    });

    newSocket.on('level:up', ({ newLevel }) => {
      toast.success(`Level Up! You're now Level ${newLevel}! 🎉`, {
        duration: 5000,
        icon: '🏆',
        style: { background: '#1a1a2e', color: '#00cec9', border: '1px solid #6c5ce7' },
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    });

    newSocket.on('badge:unlocked', ({ badge }) => {
      toast.success(`Badge Unlocked: ${badge.name} ${badge.icon}`, {
        duration: 5000,
        icon: '🏅',
        style: { background: '#1a1a2e', color: '#a855f7', border: '1px solid #a855f7' },
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
