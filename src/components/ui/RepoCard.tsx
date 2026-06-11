import type { GitHubRepo } from '@/types';
import { StarIcon, ForkIcon, ArrowRightIcon } from './Icons';

/** Approximate GitHub language colours for the language dot. */
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
};

interface RepoCardProps {
  repo: GitHubRepo;
}

/** Compact card for a single repo in the live "Latest from GitHub" feed. */
export function RepoCard({ repo }: RepoCardProps) {
  const color = repo.language ? languageColors[repo.language] ?? '#8b949e' : '#8b949e';

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-xl border border-white/10 bg-ink-900/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-ink-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-white/90 group-hover:text-accent-cyan">
          {repo.name}
        </span>
        <ArrowRightIcon
          width={16}
          height={16}
          className="text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/70"
        />
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50 line-clamp-3">
        {repo.description ?? 'No description provided.'}
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-white/45">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="inline-flex items-center gap-1">
            <StarIcon width={14} height={14} /> {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="inline-flex items-center gap-1">
            <ForkIcon width={14} height={14} /> {repo.forks_count}
          </span>
        )}
      </div>
    </a>
  );
}
