/**
 * Tiny class-name combiner — filters falsy values and joins with spaces.
 * Avoids pulling in clsx for a one-liner.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
