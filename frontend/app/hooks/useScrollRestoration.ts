import { useEffect, useRef } from "react";

const scrollPositions = new Map<string, number>();

export function useScrollRestoration<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);

  // Restore scroll position on mount
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const saved = scrollPositions.get(key);
    if (saved != null) {
      el.scrollTop = saved;
    }

    const handleScroll = () => {
      scrollPositions.set(key, el.scrollTop);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [key]);

  return ref;
}
