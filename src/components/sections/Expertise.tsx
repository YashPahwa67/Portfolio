import { content } from '@/data/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { FloatingDecor } from '@/components/ui/FloatingDecor';

const { capabilities } = content;

/**
 * "What I Do" — high-level capabilities as numbered, floating cards (the reel's
 * services-list aesthetic), but framed around real work so it reads honestly to
 * a hiring audience. Each card floats with a hover glow and a large ghost number.
 */
export function Expertise() {
  return (
    <Section
      id="expertise"
      index="02"
      title="What I Do"
      intro="A few things I do well — each one backed by something I've actually shipped."
      decor={<FloatingDecor variant="b" />}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {capabilities.map((cap, i) => (
          <Reveal key={cap.title} delay={(i % 2) * 0.08}>
            <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900/40 p-7 shadow-[0_20px_50px_-34px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-accent-indigo/40 hover:shadow-[0_0_42px_-10px_rgba(99,102,241,0.42)]">
              {/* Oversized ghost number — the "numbered list" motif from the reel. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-8 select-none text-9xl font-extrabold leading-none text-white/[0.03]"
              >
                {i + 1}
              </span>

              <span className="font-mono text-sm text-accent-cyan">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white">{cap.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">{cap.blurb}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {cap.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/55"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
