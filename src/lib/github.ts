import type { GitHubRepo } from '@/types';

/**
 * GitHub REST client for the live "Latest from GitHub" feed.
 *
 * Design goals:
 *  - Never crash the page: every failure path returns a typed error string.
 *  - Be polite to the API: results are cached in sessionStorage for 30 min so
 *    re-renders / soft navigations don't re-hit the (rate-limited) endpoint.
 *  - Degrade gracefully: unauthenticated requests get 60 req/h per IP, which is
 *    plenty for a portfolio. A token (VITE_GITHUB_TOKEN) is optional.
 */

const API_ROOT = 'https://api.github.com';
const CACHE_KEY = 'gh-repos-cache:v4';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Repos hidden from the live feed — scratch/course/test repos that aren't
 * portfolio-worthy, so real projects (Typeify, etc.) surface instead.
 * Compared case-insensitively. Edit this list to curate the feed.
 */
const HIDDEN_REPOS = new Set(['xebiaa', 'resume-cv', 'ucs420']);

/**
 * Repos surfaced FIRST in the feed (in this order), regardless of push date —
 * so your best work always leads. Anything not listed follows, newest first.
 */
const PINNED_REPOS = [
  'typeify',
  'internship-platform',
  'leaf_disease_detection',
  'pcod-management',
  'selftuned-chatbot',
  'ai-placement-platform',
];

interface CacheEntry {
  fetchedAt: number;
  username: string;
  repos: GitHubRepo[];
}

function readCache(username: string): GitHubRepo[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    const fresh = Date.now() - entry.fetchedAt < CACHE_TTL_MS;
    return fresh && entry.username === username ? entry.repos : null;
  } catch {
    // Private mode / quota errors — just skip the cache.
    return null;
  }
}

function writeCache(username: string, repos: GitHubRepo[]): void {
  try {
    const entry: CacheEntry = { fetchedAt: Date.now(), username, repos };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* sessionStorage may be unavailable — non-fatal. */
  }
}

/** Custom error so the hook can show a precise message (esp. rate limits). */
export class GitHubError extends Error {
  constructor(
    message: string,
    readonly kind: 'rate-limit' | 'not-found' | 'network' | 'unknown',
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

/**
 * Fetch a user's public repos, newest-pushed first.
 * @param username GitHub login.
 * @param signal   Optional AbortSignal so callers can cancel on unmount.
 */
export async function fetchUserRepos(
  username: string,
  signal?: AbortSignal,
): Promise<GitHubRepo[]> {
  const cached = readCache(username);
  if (cached) return cached;

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(
      `${API_ROOT}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
      { headers, signal },
    );
  } catch (err) {
    // AbortError is expected on unmount — rethrow so the hook can ignore it.
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new GitHubError('Network request failed.', 'network');
  }

  if (!res.ok) {
    // 403 + remaining=0 is the classic unauthenticated rate-limit response.
    if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
      throw new GitHubError('GitHub API rate limit reached — try again shortly.', 'rate-limit');
    }
    if (res.status === 404) {
      throw new GitHubError(`GitHub user "${username}" not found.`, 'not-found');
    }
    throw new GitHubError(`GitHub responded with ${res.status}.`, 'unknown');
  }

  const raw = (await res.json()) as GitHubRepo[];
  // Keep only original (non-fork, non-archived) repos and trim to our typed shape.
  const repos: GitHubRepo[] = raw
    .filter((r) => !r.fork && !r.archived && !HIDDEN_REPOS.has(r.name.toLowerCase()))
    .map((r) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      topics: r.topics ?? [],
      fork: r.fork,
      archived: r.archived,
      pushed_at: r.pushed_at,
    }));

  // Pinned repos lead (in PINNED_REPOS order); everything else keeps the API's
  // newest-pushed-first order behind them.
  repos.sort((a, b) => {
    const ai = PINNED_REPOS.indexOf(a.name.toLowerCase());
    const bi = PINNED_REPOS.indexOf(b.name.toLowerCase());
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  writeCache(username, repos);
  return repos;
}
