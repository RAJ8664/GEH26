import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * ThemeProvider — injects theme.primary as a CSS custom property and
 * loads the Google Font specified in theme.font.
 */
export function ThemeProvider({ theme, children }) {
  const primary = theme?.primary ?? '#4F46E5';
  const font = theme?.font ?? 'Inter';

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--font-game', `'${font}', sans-serif`);
  }, [primary, font]);

  useEffect(() => {
    const linkId = 'game-font-link';
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;700&display=swap`;
  }, [font]);

  return (
    <ThemeContext.Provider value={{ primary, font }}>
      <div style={{ fontFamily: `'${font}', sans-serif` }} className="min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
