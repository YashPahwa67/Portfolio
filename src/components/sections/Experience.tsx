import { content } from '@/data/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';

const { experience } = content;

export function Experience() {
  return (
    <Section
      id="experience"
      index="05"
      title="Experience"
      intro="Where I've shipped real work."
    >
      <ol className="relative border-l border-white/10">
        {experience.map((item, i) => (
          <li key={`${item.company}-${i}`} className="relative ml-6 pb-12 last:pb-0">
            {/* Timeline node */}
            <span
              aria-hidden
              className="absolute -left-[1.92rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent-cyan bg-ink-950"
            />
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-ink-900/40 p-6 shadow-[0_20px_50px_-34px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-accent-indigo/30 hover:shadow-[0_0_36px_-12px_rgba(99,102,241,0.34)]">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="text-lg font-semibold text-white">
                    {item.role} ·{' '}
                    <span className="text-accent-cyan">{item.company}</span>
                  </h3>
                  <span className="shrink-0 font-mono text-sm text-white/45">{item.period}</span>
                </div>

                <ul className="mt-4 space-y-2">
                  {item.highlights.map((h, hi) => (
                    <li key={hi} className="flex gap-2 text-sm leading-relaxed text-white/65">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-cyan/70" />
                      {h}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-white/55"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
