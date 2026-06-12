/**
 * Shared domain types for the portfolio.
 * Content in `src/data/content.ts` is validated against these at compile time.
 */

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  /** Public path to the résumé PDF served from /public. */
  resume: string;
}

export interface AvatarConfig {
  /**
   * A 2D portrait image path (e.g. /avatar.png). When set, the hero shows the
   * "living portrait" — a cursor-parallax / floating treatment of your photo.
   * Highest priority centrepiece. Leave empty to fall back to `url` or the orb.
   */
  image?: string;
  /**
   * A 3D avatar .glb URL (e.g. from Ready Player Me). Used when `image` is unset.
   * Replaces the shader orb with a head-tracking 3D model. Empty → orb fallback.
   */
  url: string;
  /** Uniform scale applied to the loaded .glb model. */
  scale?: number;
  /** World position offset — tune to frame the bust/upper body. */
  position?: [number, number, number];
}

export interface Profile {
  name: string;
  /** Short professional title, e.g. "Full-Stack & AI/ML Engineer". */
  title: string;
  /** One-line value proposition shown in the hero. */
  tagline: string;
  /** Rotating role words for the hero typewriter. */
  roles: string[];
  location: string;
  /** GitHub username used by the live repos feed. */
  githubUsername: string;
  social: SocialLinks;
  /** Hero 3D avatar config (optional — orb fallback when url is empty). */
  avatar: AvatarConfig;
}

export interface AboutContent {
  /** 2–4 short paragraphs. */
  paragraphs: string[];
  /** Headline stats shown as a small grid. */
  highlights: { label: string; value: string }[];
}

export interface Capability {
  /** Capability heading, e.g. "Full-Stack Engineering". */
  title: string;
  /** One-line description of what it means in practice. */
  blurb: string;
  /** Supporting keywords/tags. */
  items: string[];
}

export interface SkillGroup {
  /** Group heading, e.g. "Frontend". */
  category: string;
  /** Short helper line for the group. */
  blurb: string;
  skills: string[];
}

export interface Project {
  title: string;
  /** One-paragraph summary written for a human reviewer. */
  description: string;
  tech: string[];
  /** Public GitHub repo URL, if one exists. */
  repoUrl?: string;
  /** Live deployment URL, if one exists. */
  liveUrl?: string;
  /** When there's no liveUrl yet, show a muted "Live · upcoming" indicator instead. */
  liveUpcoming?: boolean;
  /** Optional cover image (e.g. /projects/typeify.png). Falls back to a generated cover. */
  image?: string;
  /** How the cover image fills the banner. 'contain' fits wide figures fully (default 'cover'). */
  imageFit?: 'cover' | 'contain';
  /** Banner background behind a 'contain' image. Use 'white' for white-background figures. */
  imageBg?: 'dark' | 'white';
  /** Focal alignment for a 'cover' image (default center). 'right' keeps the right edge in view. */
  imagePosition?: 'left' | 'center' | 'right';
  /** Whether to feature this project in the curated grid. */
  featured: boolean;
  /** Short tag used for the card's corner label. */
  domain: 'Full-Stack' | 'Machine Learning' | 'Computer Vision' | 'Automation';
}

export interface ExperienceItem {
  role: string;
  company: string;
  /** Human-readable period, e.g. "Jul 2025 – Sep 2025". */
  period: string;
  location?: string;
  /** Bullet-point highlights. */
  highlights: string[];
  /** Tech / tools used. */
  stack: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  /** e.g. "8.33 GPA" or "78.64%". */
  score: string;
  period: string;
}

export interface SiteContent {
  profile: Profile;
  about: AboutContent;
  capabilities: Capability[];
  skills: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

/* ---------- GitHub API ---------- */

/** The subset of the GitHub REST repo object we actually use. */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

export type RepoFetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; repos: GitHubRepo[] }
  | { status: 'error'; message: string };
