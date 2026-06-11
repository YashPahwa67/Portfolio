import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Reactive `prefers-reduced-motion` flag.
 *
 * We gate the entire 3D scene and large motion on this: when a visitor has
 * reduced motion enabled, they get a calm, static experience instead of WebGL.
 * Listening to changes (not just reading once) means toggling the OS setting
 * updates the page live.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
