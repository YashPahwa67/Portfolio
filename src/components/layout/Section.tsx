import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

interface SectionProps {
  /** Anchor id — must match the nav links and useActiveSection list. */
  id: string;
  /** Two-digit index shown before the title, e.g. "01". */
  index: string;
  title: string;
  /** Optional one-line description under the heading. */
  intro?: string;
  children: ReactNode;
  className?: string;
  /** Optional decorative layer (e.g. floating glass objects) behind the content. */
  decor?: ReactNode;
}

/**
 * Semantic <section> rendered as a "stacked panel": a rounded, frosted dark
 * surface that overlaps the previous section (negative top margin) and rises
 * into place as it scrolls in — the reel's layered "new page comes in" effect,
 * but non-destructive (content stays fully scrollable, nothing is pinned).
 *
 *  - `-mt-*` pulls each panel up over the one before; the rounded top + upward
 *    shadow + glowing seam read as one surface sliding over another.
 *  - `bg-ink-950/85 backdrop-blur` keeps the ambient particles faintly visible
 *    behind the frosted glass instead of hiding them.
 *  - The whole panel eases up on enter (skipped under reduced motion).
 */
export function Section({ id, index, title, intro, children, className, decor }: SectionProps) {
  const headingId = `${id}-heading`;
  const reduced = useReducedMotion();

  return (
    <motion.section
      id={id}
      aria-labelledby={headingId}
      initial={reduced ? false : { opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative -mt-10 scroll-mt-24 overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-ink-950/85 px-6 py-24 shadow-[0_-40px_90px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl md:-mt-16 md:rounded-t-[3.5rem] md:py-32',
        className,
      )}
    >
      {/* Glowing seam at the panel's leading edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/60 to-transparent"
      />

      {decor}

      <div className="relative mx-auto w-full max-w-content">
        <Reveal>
          <div className="mb-12 md:mb-16">
            <span className="font-mono text-sm text-accent-cyan">{index}.</span>
            <h2
              id={headingId}
              className="heading-glow mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              {title}
            </h2>
            {intro && <p className="mt-4 max-w-2xl text-base text-white/60 md:text-lg">{intro}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </motion.section>
  );
}
