import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Lightweight visibility hook backed by IntersectionObserver.
 *
 * Used to pause the WebGL render loop when the hero scrolls off-screen — there's
 * no reason to burn GPU cycles animating a canvas nobody can see, which keeps the
 * page at 60fps and saves battery on mobile.
 *
 * @returns A ref to attach and a boolean for whether it's in view.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { rootMargin: '0px', threshold: 0 },
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}
