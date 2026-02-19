"use client";

import {
  createContext,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/navigation";

interface TransitionContextValue {
  navigateWithTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateWithTransition: () => {},
});

export function usePageTransitionNav() {
  return useContext(TransitionContext);
}

interface TransitionProviderProps {
  children: React.ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const router = useRouter();

  const navigateWithTransition = useCallback(
    (href: string) => {
      // Fallback for browsers without View Transitions API
      if (!document.startViewTransition) {
        router.push(href);
        return;
      }

      document.startViewTransition(() => {
        router.push(href);
      });
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}
