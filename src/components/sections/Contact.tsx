import { useState } from 'react';
import { content } from '@/data/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from '@/components/ui/Icons';

const { profile } = content;

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.social.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context) — the mailto link still works.
      setCopied(false);
    }
  }

  return (
    <Section
      id="contact"
      index="06"
      title="Let's build something"
      intro="I'm open to internships, freelance and interesting collaborations. The fastest way to reach me is email."
    >
      <Reveal>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900/80 to-ink-950 p-6 sm:p-8 md:p-12">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-white/50">Email me at</p>
              <button
                type="button"
                onClick={copyEmail}
                className="group mt-1 flex w-full max-w-full flex-col items-start gap-1 text-base font-semibold text-white transition-colors hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan sm:flex-row sm:items-center sm:gap-3 sm:text-2xl md:text-3xl"
                aria-label={`Copy email address ${profile.social.email}`}
              >
                <span className="min-w-0 max-w-full break-all">{profile.social.email}</span>
                <span className="shrink-0 font-mono text-xs text-white/40 group-hover:text-accent-cyan">
                  {copied ? 'copied ✓' : 'click to copy'}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Button href={`mailto:${profile.social.email}`} variant="primary">
                Say hello <MailIcon width={16} height={16} />
              </Button>
              <Button href={profile.social.resume} variant="secondary" download>
                Download résumé <DownloadIcon width={16} height={16} />
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
            <Button href={profile.social.github} variant="secondary">
              <GitHubIcon width={18} height={18} /> GitHub
            </Button>
            <Button href={profile.social.linkedin} variant="secondary">
              <LinkedInIcon width={18} height={18} /> LinkedIn
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
