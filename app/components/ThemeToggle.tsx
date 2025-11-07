'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

/**
 * Applies the selected theme by directly setting CSS variables on the root element.
 * @param theme - The theme to apply ('light' or 'dark')
 */
const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement;
  
  // This list matches the variables from your SettingsView example
  root.style.setProperty('--current-surface', `var(--surface-color-${theme})`);
  root.style.setProperty('--current-font-color', `var(--font-color-${theme})`);
  root.style.setProperty('--surface-color', `var(--surface-color-${theme})`);
  root.style.setProperty('--font-color', `var(--font-color-${theme})`);
  root.style.setProperty('--background-color', `var(--background-color-${theme})`);
  root.style.setProperty('--wallpaper', `var(--wallpaper-${theme})`);
  root.style.setProperty('--icon-filter', `var(--icon-filter-${theme})`);
  root.style.setProperty('--accent-color', `var(--accent-color-${theme})`);
  root.style.setProperty('--terminal-output-color', `var(--terminal-output-color-${theme})`);
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-(--surface-color) text-(--font-color) hover:bg-(--font-color)/10 transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}