import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Synchronous initialization reading the final state left by the Web Component
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    // Passive listening: React only re-renders when the agnostic component notifies
    const handleThemeChange = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };

    window.addEventListener('theme-changed', handleThemeChange);

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
    };
  }, []);

  return theme;
}
