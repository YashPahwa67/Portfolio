import { useEffect, useState } from 'react';

/**
 * Tracks which section id is currently in view (for nav highlighting).
 * Uses a single IntersectionObserver with a rootMargin biased toward the upper
 * third of the viewport so the "active" link flips at a natural reading point.
 *
 * @param sectionIds Ordered list of section element ids to observe.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
