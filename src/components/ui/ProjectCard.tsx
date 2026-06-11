import { type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';
import { ExternalIcon, GitHubIcon } from './Icons';

/** Per-domain accent so each card is colour-coded at a glance. */
const domainStyles: Record<Project['domain'], { gradient: string; chip: string }> = {
  'Full-Stack': { gradient: 'from-cyan-400/25 via-indigo-500/10', chip: 'text-cyan-300 border-cyan-400/30' },
  'Machine Learning': { gradient: 'from-violet-400/25 via-fuchsia-500/10', chip: 'text-violet-300 border-violet-400/30' },
  'Computer Vision': { gradient: 'from-emerald-400/25 via-teal-500/10', chip: 'text-emerald-300 border-emerald-400/30' },
  Automation: { gradient: 'from-amber-400/25 via-orange-500/10', chip: 'text-amber-300 border-amber-400/30' },
};

/** Derive "owner/name" from a repo URL for the generated cover art. */
function repoSlug(url?: string): string | null {
  if (!url) return null;
  return url.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
}

interface ProjectCardProps {
  project: Project;
}

/**
 * Interactive project card with a cursor-driven 3D tilt.
 *
 * The tilt is pure CSS 3D: we track the pointer's position within the card
 * (0..1) and map it to small rotateX/rotateY values via springs for a weighty,
 * non-jittery feel. Tilt is disabled under prefers-reduced-motion.
 *
 * When no `image` is supplied we render a generated cover (gradient + dotted
 * grid + the repo slug) so every card has a visual without faking screenshots.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const reduced = useReducedMotion();
  const style = domainStyles[project.domain];
  const slug = repoSlug(project.repoUrl);

  // Pointer position within the card, normalized to -0.5..0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 16 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 16 });

  function handleMove(e: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div className="[perspective:1200px]">
      <motion.article
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.95)] backdrop-blur-sm transition-all duration-300 hover:border-accent-indigo/40 hover:shadow-[0_0_48px_-10px_rgba(99,102,241,0.45)]"
      >
        {/* ── Cover ─────────────────────────────────────────────── */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                'relative flex h-full w-full items-center justify-center bg-gradient-to-br to-ink-900',
                style.gradient,
              )}
            >
              {/* Dotted grid for a technical, blueprint-y texture. */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              />
              <span className="relative px-4 text-center font-mono text-sm text-white/70 sm:text-base">
                {slug ?? project.title}
              </span>
            </div>
          )}
          <span
            className={cn(
              'absolute left-3 top-3 rounded-full border bg-ink-950/70 px-3 py-1 text-xs font-medium backdrop-blur',
              style.chip,
            )}
          >
            {project.domain}
          </span>
        </div>

        {/* ── Body ──────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{project.description}</p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-white/55"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-4 text-sm">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-accent-cyan transition-colors hover:text-white"
                aria-label={`Open the live demo of ${project.title}`}
              >
                Live demo <ExternalIcon width={16} height={16} />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-white/70 transition-colors hover:text-white"
                aria-label={`View the source of ${project.title} on GitHub`}
              >
                Code <GitHubIcon width={16} height={16} />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
