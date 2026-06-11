import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger helper: seconds to delay the entrance. */
  delay?: number;
  /** Travel distance in px (ignored under reduced motion). */
  y?: number;
  className?: string;
}

/**
 * Scroll-into-view entrance. Fades + lifts content once when it first enters the
 * viewport. Honors prefers-reduced-motion: motion collapses to a plain fade (no
 * transform), so the page stays calm for users who asked for that.
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}
