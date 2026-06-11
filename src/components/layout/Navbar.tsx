import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '@/data/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { DownloadIcon } from '@/components/ui/Icons';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'What I Do' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

const SECTION_IDS = ['hero', ...NAV_LINKS.map((l) => l.id)];

/**
 * Sticky top navigation with scroll-spy (active link follows the viewport) and
 * an accessible mobile menu. Links are real in-page anchors so keyboard users
 * and "open in new tab" both work; the active state is purely visual.
 */
export function Navbar() {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add a frosted background only after the user scrolls off the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled ? 'border-b border-white/10 bg-ink-950/70 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-content items-center justify-between px-6"
      >
        <a
          href="#hero"
          className="text-base font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
        >
          {content.profile.name}
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                className={cn(
                  'rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
                  active === link.id ? 'text-white' : 'text-white/55 hover:text-white',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href={content.profile.social.resume} variant="secondary" download>
            Résumé <DownloadIcon width={16} height={16} />
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span
              className={cn('block h-0.5 w-6 bg-current transition-transform', menuOpen && 'translate-y-2 rotate-45')}
            />
            <span className={cn('block h-0.5 w-6 bg-current transition-opacity', menuOpen && 'opacity-0')} />
            <span
              className={cn('block h-0.5 w-6 bg-current transition-transform', menuOpen && '-translate-y-2 -rotate-45')}
            />
          </div>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-white/10 bg-ink-950/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Button href={content.profile.social.resume} variant="secondary" download className="w-full">
                  Résumé <DownloadIcon width={16} height={16} />
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
