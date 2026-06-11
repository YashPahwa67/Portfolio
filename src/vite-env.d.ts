/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional GitHub token for the repos feed (see .env.example). */
  readonly VITE_GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
