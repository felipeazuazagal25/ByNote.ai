import { useState, useEffect } from "react";

export const useUIState = <T>(key: string, defaultValue: T) => {
  // Initialize state from localStorage if available
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
};
