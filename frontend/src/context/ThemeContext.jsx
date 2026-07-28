// ============================================================
// context/ThemeContext.jsx — Dark Mode State Management
// Reads user preference from localStorage and system preference.
// Toggles 'dark' class on the <html> element (Tailwind strategy).
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Initialize from localStorage, fallback to system preference
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    // Check OS/browser dark mode preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply/remove 'dark' class on <html> whenever isDark changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usage: const { isDark, toggleTheme } = useTheme();
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
