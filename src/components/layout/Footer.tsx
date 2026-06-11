import { content } from '@/data/content';
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/components/ui/Icons';

const { profile } = content;

/** Site footer: quick social links + a build credit. */
export function Footer() {
  const socials = [
    { href: profile.social.github, label: 'GitHub', Icon: GitHubIcon },
    { href: profile.social.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { href: `mailto:${profile.social.email}`, label: 'Email', Icon: MailIcon },
  ];

  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} {profile.name}. Built with React, Three.js & Tailwind.
        </p>
        <ul className="flex items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                <Icon width={18} height={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
