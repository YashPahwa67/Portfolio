import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from '@/data/content';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, DownloadIcon, MailIcon } from '@/components/ui/Icons';
import { HeroPortrait } from './HeroPortrait';

// Lazy-load the entire WebGL bundle so Three.js never blocks first paint.
const Scene = lazy(() => import('@/components/three/Scene'));

const { profile } = content;
const portraitSrc = profile.avatar.image?.trim();

/** Soft radial glow used as the Suspense fallback AND the reduced-motion backdrop. */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.28),rgba(34,211,238,0.12)_45%,transparent_70%)] blur-2xl" />
    </div>
  );
}

/** Cross-fades through the role words. Falls back to a static line for reduced motion. */
function RotatingRoles({ roles, reduced }: { roles: string[]; reduced: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [roles.length, reduced]);

  if (reduced) {
    return <span className="text-accent-cyan">{roles.join(' · ')}</span>;
  }

  return (
    <span className="relative inline-grid">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ y: '0.6em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.6em', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-accent-cyan [grid-area:1/1]"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** The shared text column (heading, roles, tagline, CTAs). */
function HeroIntro({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl"
    >
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs text-white/70">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Available for internships & freelance
      </p>

      <h1 className="text-glow text-balance text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
        {profile.name}
      </h1>

      <p className="mt-4 text-xl font-medium text-white/80 sm:text-2xl">
        <RotatingRoles roles={profile.roles} reduced={reduced} />
      </p>

      <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
        {profile.tagline}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button href="#projects" variant="primary">
          View Work{' '}
          <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
        </Button>
        <Button href={profile.social.resume} variant="secondary" download>
          Résumé <DownloadIcon width={16} height={16} />
        </Button>
        <Button href="#contact" variant="ghost">
          Contact <MailIcon width={16} height={16} />
        </Button>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  // Pause the WebGL render loop once the hero scrolls away (saves GPU/battery).
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.05 });

  // Layout when a portrait photo is set.
  //  - Mobile (single column): name → photo → description (the order asked for).
  //  - Desktop (2-col grid): name + description stacked on the LEFT, photo RIGHT.
  // DOM order is name, photo, description; CSS grid placement re-flows it on md+.
  if (portraitSrc) {
    return (
      <section
        id="hero"
        ref={ref}
        aria-label="Introduction"
        className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-24 md:pt-16"
      >
        <div className="mx-auto grid w-full max-w-content gap-y-10 md:grid-cols-2 md:gap-x-10 md:gap-y-0">
          {/* Name + role */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl md:col-start-1 md:row-start-1 md:self-end"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available for internships & freelance
            </p>
            <h1 className="text-glow text-balance text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-4 text-xl font-medium text-white/80 sm:text-2xl">
              <RotatingRoles roles={profile.roles} reduced={reduced} />
            </p>
          </motion.div>

          {/* Portrait — between name and description on mobile; right column on desktop */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="md:col-start-2 md:row-span-2 md:self-center"
          >
            <HeroPortrait src={portraitSrc} alt={profile.name} reduced={reduced} />
          </motion.div>

          {/* Tagline + CTAs */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl md:col-start-1 md:row-start-2 md:mt-6 md:self-start"
          >
            <p className="max-w-xl text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
              {profile.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#projects" variant="primary">
                View Work{' '}
                <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button href={profile.social.resume} variant="secondary" download>
                Résumé <DownloadIcon width={16} height={16} />
              </Button>
              <Button href="#contact" variant="ghost">
                Contact <MailIcon width={16} height={16} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Otherwise: full-bleed 3D centrepiece (orb or .glb avatar) behind the intro.
  return (
    <section
      id="hero"
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-16"
    >
      {reduced ? (
        <HeroBackdrop />
      ) : (
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={<HeroBackdrop />}>
            <Scene active={inView} avatar={profile.avatar} />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>
      )}

      <div className="mx-auto w-full max-w-content">
        <HeroIntro reduced={reduced} />
      </div>
    </section>
  );
}
