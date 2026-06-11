import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { content } from '@/data/content';

const { profile } = content;
const photoSrc = profile.avatar.image?.trim() || '/profile.jpg';
const initials = profile.name
  .split(' ')
  .map((p) => p[0])
  .join('')
  .slice(0, 2);

const spring = { stiffness: 120, damping: 18, mass: 0.6 };

/**
 * "Avatar window" for the About section — the reel's framed, glowing avatar,
 * built from the real photo. It's styled as a developer window (traffic-light
 * chrome + filename) over a blurred code backdrop, with neon depth.
 *
 * Honest scope: a flat photo can't blink or turn its head — that needs a rigged
 * 3D model or a generated video. So "aliveness" here is faked tastefully with a
 * cursor-parallax tilt, an idle float, and a pulsing glow + presence indicator.
 * Everything collapses to a still frame under prefers-reduced-motion.
 */
export function AboutAvatar() {
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Local reduced-motion read (cheap; avoids prop drilling).
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, []);

  // Cursor parallax (subtler than the hero).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), spring);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, mx, my]);

  return (
    <div className="relative mx-auto w-full max-w-xs [perspective:1100px]">
      {/* Pulsing neon glow behind the frame */}
      <motion.div
        aria-hidden
        className="absolute -inset-4 rounded-3xl bg-[radial-gradient(circle,rgba(99,102,241,0.45),rgba(34,211,238,0.15)_55%,transparent_75%)] blur-2xl"
        animate={reduced ? undefined : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Gradient (neon) border via padding-box trick */}
        <div className="rounded-2xl bg-gradient-to-br from-accent-cyan/70 via-accent-indigo/70 to-accent-violet/70 p-[1.5px] shadow-[0_30px_70px_-25px_rgba(99,102,241,0.6)]">
          <div className="overflow-hidden rounded-2xl bg-ink-950">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-ink-900/80 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-xs text-white/40">yash.portrait.tsx</span>
            </div>

            {/* Body: blurred code backdrop + photo */}
            <div className="relative aspect-[4/5]">
              {/* Dimmed, blurred code — pure decoration */}
              <pre
                aria-hidden
                className="absolute inset-0 select-none overflow-hidden whitespace-pre-wrap p-4 font-mono text-[10px] leading-5 text-accent-cyan/20 blur-[1px]"
              >{`const yash = {
  role: 'Full-Stack & ML',
  stack: ['react','node','ml'],
  status: 'available',
  build: () => ship(),
}
export default yash;`}</pre>

              {/* Photo (or monogram fallback) */}
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent-indigo/20 to-accent-cyan/10">
                <span className="font-mono text-6xl font-bold text-white/70">{initials}</span>
              </div>
              {!failed && (
                <img
                  src={photoSrc}
                  alt={profile.name}
                  onError={() => setFailed(true)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {/* Subtle vignette so the photo sits in the dark frame */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            </div>

            {/* Presence bar — "ready to communicate" */}
            <div className="flex items-center gap-2 border-t border-white/10 bg-ink-900/80 px-4 py-2.5">
              <span className="relative flex h-2 w-2">
                {!reduced && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-xs text-white/55">available to talk</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
