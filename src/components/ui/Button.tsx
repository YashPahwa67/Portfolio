import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:-translate-y-0.5 shadow-[0_8px_30px_-10px_rgba(99,102,241,0.8)] hover:shadow-[0_10px_40px_-8px_rgba(99,102,241,0.9)]',
  secondary: 'border border-white/15 text-white/90 hover:bg-white/[0.06] hover:border-white/30',
  ghost: 'text-white/70 hover:text-white',
};

const baseClasses =
  'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950';

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
}

// A single component that renders an <a> when `href` is present, else a <button>.
// Keeping them in one union means call-sites get the right native props either way.
type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsLink = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', className, children, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ('href' in props && props.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
