import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HeroPortraitProps {
  src: string;
  alt: string;
  /** When true, render a calm static portrait (no tilt/float). */
  reduced: boolean;
}

const spring = { stiffness: 120, damping: 18, mass: 0.6 };

/**
 * "Living portrait" — a 2.5D treatment of a single photo that fakes depth with
 * pure CSS 3D + Framer Motion (no WebGL, so it never touches the Three.js bundle).
 *
 * Depth recipe:
 *  - The whole card tilts toward the cursor (rotateX/rotateY).
 *  - The glow behind it parallaxes the OPPOSITE way and less far, so it reads as
 *    sitting further back — the classic multi-plane parallax trick.
 *  - A slow idle float keeps it alive when the cursor is still.
 * Collapses to a plain image under prefers-reduced-motion, and to a gradient
 * monogram if the image file is missing (so there's never a broken-image icon).
 */
export function HeroPortrait({ src, alt, reduced }: HeroPortraitProps) {
  const [failed, setFailed] = useState(false);
  const initials = alt
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  // Normalized cursor offset from screen centre (-0.5..0.5).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring);
  // Glow drifts opposite + smaller → appears to sit behind the portrait.
  const glowX = useSpring(useTransform(mx, [-0.5, 0.5], [16, -16]), spring);
  const glowY = useSpring(useTransform(my, [-0.5, 0.5], [16, -16]), spring);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, mx, my]);

  // Shared visual for the photo (or monogram fallback) inside a circular frame.
  const Photo = (
    <>
      <div className="absolute inset-0 grid place-items-center rounded-full bg-gradient-to-br from-accent-indigo/40 via-accent-violet/25 to-accent-cyan/25">
        <span className="font-mono text-6xl font-bold text-white/80">{initials}</span>
      </div>
      {!failed && (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          // Hero portrait is the likely LCP element — load it eagerly, high priority.
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full rounded-full border border-white/15 object-cover"
        />
      )}
    </>
  );

  if (reduced) {
    return (
      <div className="relative mx-auto aspect-square w-64 sm:w-80 md:w-96">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.35),transparent_70%)] blur-2xl" />
        <div className="relative h-full w-full overflow-hidden rounded-full">{Photo}</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-square w-64 [perspective:1000px] sm:w-80 md:w-96">
      {/* Parallax glow plane (sits behind) */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.45),rgba(34,211,238,0.18)_45%,transparent_70%)] blur-2xl"
      />

      {/* Idle float wrapper */}
      <motion.div
        className="relative h-full w-full"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Tilt card */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative h-full w-full"
        >
          {/* Gradient ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-cyan via-accent-indigo to-accent-violet opacity-60 blur-[2px]" />
          <div
            className="relative h-full w-full overflow-hidden rounded-full shadow-[0_30px_80px_-20px_rgba(99,102,241,0.6)]"
            style={{ transform: 'translateZ(40px)' }}
          >
            {Photo}
          </div>
          {/* Small accent badge floating in front for extra depth */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-ink-900/80 px-4 py-1.5 font-mono text-xs text-white/80 backdrop-blur"
            style={{ transform: 'translateZ(70px)' }}
          >
            available for work
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
