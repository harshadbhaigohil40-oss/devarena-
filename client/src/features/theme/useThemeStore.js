import { create } from 'zustand';

// Check local storage or system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark'; // Default to dark if no preference
};

const applyThemeDOM = (theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
    }
  }
};

const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') {
  applyThemeDOM(initialTheme);
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => {
      applyThemeDOM(initialTheme);
    });
  }
}

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    applyThemeDOM(newTheme);
    set({ theme: newTheme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyThemeDOM(newTheme);
    return { theme: newTheme };
  })
}));
