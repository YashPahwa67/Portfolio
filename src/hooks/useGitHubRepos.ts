import { useEffect, useState } from 'react';
import { fetchUserRepos, GitHubError } from '@/lib/github';
import type { RepoFetchState } from '@/types';

/**
 * Loads a user's public repos and exposes a discriminated-union state so the UI
 * can render loading / error / success without nullable-flag spaghetti.
 *
 * @param username GitHub login.
 * @param limit    Max repos to surface (sorted by most-recently pushed).
 */
export function useGitHubRepos(username: string, limit = 6): RepoFetchState {
  const [state, setState] = useState<RepoFetchState>({ status: 'idle' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchUserRepos(username, controller.signal)
      .then((repos) => {
        setState({ status: 'success', repos: repos.slice(0, limit) });
      })
      .catch((err: unknown) => {
        // Ignore aborts triggered by unmount / fast refresh.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof GitHubError ? err.message : 'Could not load repositories.';
        setState({ status: 'error', message });
      });

    return () => controller.abort();
  }, [username, limit]);

  return state;
}
