"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { firestoreDb } from "@/lib/firebase/client";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("light");

  /*
   * Read the saved theme from Firestore
   */
  useEffect(() => {
    const db = firestoreDb;

    if (!db) {
      return;
    }

    const settingsRef = doc(
      db,
      "settings",
      "admin"
    );

    return onSnapshot(
      settingsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          applyTheme("light");
          setThemeState("light");
          return;
        }

        const value =
          snapshot.data().theme;

        const nextTheme: Theme =
          value === "dark" ||
          value === "system"
            ? value
            : "light";

        setThemeState(nextTheme);
        applyTheme(nextTheme);
      },
      (error) => {
        console.error(
          "Theme listener error:",
          error
        );
      }
    );
  }, []);

  function setTheme(theme: Theme) {
    setThemeState(theme);
    applyTheme(theme);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        setTheme,
      }}
    >
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

function applyTheme(theme: Theme) {
  const root =
    document.documentElement;

  root.classList.remove(
    "light",
    "dark"
  );

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "light") {
    root.classList.add("light");
    return;
  }

  const prefersDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  root.classList.add(
    prefersDark ? "dark" : "light"
  );
}