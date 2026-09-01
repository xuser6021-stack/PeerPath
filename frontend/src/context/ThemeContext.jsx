import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContextObject';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('pathforge-theme');
    return savedTheme || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (isDark) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'light' ? 'dark' : prevTheme === 'dark' ? 'system' : 'light';
      localStorage.setItem('pathforge-theme', nextTheme);
      return nextTheme;
    });
  };

  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('pathforge-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setSpecificTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
