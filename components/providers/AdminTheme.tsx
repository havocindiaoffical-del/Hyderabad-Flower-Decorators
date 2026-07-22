"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ThemeColors {
  bgPrimary: string;
  bgCard: string;
  bgSidebar: string;
  bgInput: string;
  bgHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderColor: string;
  isDark: boolean;
}

const DARK_THEME: ThemeColors = {
  bgPrimary: "#0F0F0F",
  bgCard: "#1A1A1A",
  bgSidebar: "#141414",
  bgInput: "#222222",
  bgHover: "#222222",
  textPrimary: "#E8E2DA",
  textSecondary: "#9B9490",
  textMuted: "#6B6560",
  borderColor: "#2A2A2A",
  isDark: true,
};

const LIGHT_THEME: ThemeColors = {
  bgPrimary: "#FAF8F5",
  bgCard: "#FFFFFF",
  bgSidebar: "#FFFFFF",
  bgInput: "#FAF8F5",
  bgHover: "#F0EBE3",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6560",
  textMuted: "#9B9490",
  borderColor: "#E8E2DA",
  isDark: false,
};

const DARK_KEY = "hfd_admin_dark";

interface AdminThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: LIGHT_THEME,
  isDark: false,
  toggleTheme: () => {},
});

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DARK_KEY);
      const initial = saved === "true";
      setIsDark(initial);
      if (initial) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    const newDark = !isDark;
    setIsDark(newDark);
    try { localStorage.setItem(DARK_KEY, String(newDark)); } catch {}
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <AdminThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}
