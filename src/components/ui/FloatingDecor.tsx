import { motion, useReducedMotion } from 'framer-motion';

/**
 * Decorative floating "3D glass" objects — the scattered moon/cube/diamond motifs
 * from the reference reel, recreated in pure CSS (gradients + glow + borders), so
 * there are no image assets or WebGL. Always behind content, non-interactive, and
 * frozen under prefers-reduced-motion.
 *
 * `variant` just shifts positions/shapes so adjacent sections don't look identical.
 */
export function FloatingDecor({ variant = 'a' }: { variant?: 'a' | 'b' }) {
  const reduced = useReducedMotion();

  // Helper: gentle vertical bob (disabled for reduced motion).
  const bob = (duration: number, range = 14) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -range, 0] },
          transition: { duration, repeat: Infinity, ease: 'easeInOut' as const },
        };

  const isA = variant === 'a';

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Glowing ring (crescent-ish) */}
      <motion.div
        {...bob(7)}
        className={
          'absolute h-16 w-16 rounded-full border-2 border-accent-cyan/40 bg-accent-cyan/[0.06] shadow-[0_0_34px_-4px_rgba(34,211,238,0.55)] ' +
          (isA ? 'left-[3%] top-[20%]' : 'right-[5%] top-[16%]')
        }
      />
      {/* Iridescent cube */}
      <motion.div
        {...bob(9, 18)}
        className={
          'absolute h-14 w-14 rotate-12 rounded-lg border border-white/10 bg-gradient-to-br from-accent-violet/30 to-accent-indigo/20 shadow-[0_0_38px_-6px_rgba(168,85,247,0.55)] ' +
          (isA ? 'right-[6%] top-[12%]' : 'left-[5%] top-[24%]')
        }
      />
      {/* Small diamond */}
      <motion.div
        {...bob(8, 12)}
        className={
          'absolute h-8 w-8 rotate-45 rounded-md border border-white/10 bg-gradient-to-br from-accent-cyan/25 to-accent-violet/25 shadow-[0_0_26px_-6px_rgba(99,102,241,0.55)] ' +
          (isA ? 'right-[16%] bottom-[18%]' : 'left-[12%] bottom-[14%]')
        }
      />
    </div>
  );
}
