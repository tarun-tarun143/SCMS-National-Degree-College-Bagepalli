"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "scms-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  const resolved =
    theme === "system" ? getSystemTheme() : theme;

  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");

  root.setAttribute("data-theme", theme);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] =
    useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem(
      STORAGE_KEY
    ) as ThemeMode | null;

    const initialTheme: ThemeMode =
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
        ? storedTheme
        : "light";

    setThemeState(initialTheme);

    const resolved =
      initialTheme === "system"
        ? getSystemTheme()
        : initialTheme;

    setResolvedTheme(resolved);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = () => {
      if (initialTheme === "system") {
        const nextResolved = getSystemTheme();

        setResolvedTheme(nextResolved);
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    applyTheme(theme);

    const resolved =
      theme === "system"
        ? getSystemTheme()
        : theme;

    setResolvedTheme(resolved);

    localStorage.setItem(
      STORAGE_KEY,
      theme
    );
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = () => {
      if (theme !== "system") {
        return;
      }

      const nextResolved = getSystemTheme();

      setResolvedTheme(nextResolved);
      applyTheme("system");
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: ThemeMode) => {
        setThemeState(nextTheme);
      },
      resolvedTheme,
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}