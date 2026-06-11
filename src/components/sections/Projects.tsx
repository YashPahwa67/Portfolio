import { content } from '@/data/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { RepoCard } from '@/components/ui/RepoCard';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import { GitHubIcon } from '@/components/ui/Icons';

const { projects, profile } = content;
const featured = projects.filter((p) => p.featured);

/**
 * Live feed from the GitHub REST API — proves the integration is real, with
 * loading skeletons and a graceful error/rate-limit fallback (never blank).
 */
function GitHubFeed() {
  const state = useGitHubRepos(profile.githubUsername, 6);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading repositories">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
        <p className="text-sm text-white/60">{state.message}</p>
        <a
          href={profile.social.github}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent-cyan hover:text-white"
        >
          <GitHubIcon width={16} height={16} /> Browse on GitHub instead
        </a>
      </div>
    );
  }

  if (state.repos.length === 0) {
    return <p className="text-sm text-white/50">No public repositories to show yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {state.repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      title="Projects"
      intro="A few things I've built end to end — full-stack products and machine-learning systems. Links go to live demos and source."
    >
      {/* Curated, hand-written feature grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {/* Live GitHub strip */}
      <Reveal>
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <GitHubIcon width={20} height={20} className="text-white/70" />
            <h3 className="text-xl font-semibold text-white">Latest from GitHub</h3>
            <span className="font-mono text-xs text-white/35">live · @{profile.githubUsername}</span>
          </div>
          <GitHubFeed />
        </div>
      </Reveal>
    </Section>
  );
}
