"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Save scroll position on browser back/forward navigation
    const handleBeforeUnload = () => {
      const currentPath = window.location.pathname;
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      sessionStorage.setItem(`scroll_${currentPath}`, scrollPos.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    // Also save on popstate (browser back/forward)
    window.addEventListener('popstate', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleBeforeUnload);
    };
  }, []);

  const navigateWithTransition = useCallback(
    (href: string) => {
      // Save current scroll position before navigating
      const currentPath = window.location.pathname;
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      sessionStorage.setItem(`scroll_${currentPath}`, scrollPos.toString());

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
