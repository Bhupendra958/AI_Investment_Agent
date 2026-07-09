import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = window.document.documentElement;
    // Force dark mode
    root.classList.add("dark");
    // Apply dark background gradient
    document.body.style.background = "radial-gradient(circle at 10% 20%, rgba(30, 41, 59, 0.15), transparent 40%), radial-gradient(circle at 90% 80%, rgba(15, 23, 42, 0.2), transparent 40%), #0b0f19";
    document.body.style.color = "#cbd5e1";
  }, []);

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
