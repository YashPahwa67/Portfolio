import { content } from '@/data/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';

const { skills } = content;

export function Skills() {
  return (
    <Section
      id="skills"
      index="03"
      title="Skills"
      intro="The stack I reach for — grouped by where it lives in a project, from interface down to model."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-white/10 bg-ink-900/40 p-6 shadow-[0_20px_50px_-34px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-accent-indigo/30 hover:shadow-[0_0_36px_-12px_rgba(99,102,241,0.38)]">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">{group.category}</h3>
                <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-1 text-sm text-white/45">{group.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/75 transition-colors hover:border-accent-cyan/40 hover:text-white"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
