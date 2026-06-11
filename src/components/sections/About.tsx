import { content } from '@/data/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { FloatingDecor } from '@/components/ui/FloatingDecor';
import { AboutAvatar } from './AboutAvatar';

const { about, education } = content;

export function About() {
  return (
    <Section id="about" index="01" title="About" decor={<FloatingDecor variant="a" />}>
      <div className="grid gap-12 md:grid-cols-[280px_1fr] md:gap-16">
        {/* Left: photo + headline stats */}
        <Reveal className="space-y-6">
          <AboutAvatar />

          <dl className="grid grid-cols-2 gap-3">
            {about.highlights.map((h) => (
              <div key={h.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <dt className="text-xs uppercase tracking-wide text-white/45">{h.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{h.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Right: bio + education */}
        <div className="space-y-6">
          {about.paragraphs.map((para, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-base leading-relaxed text-white/70 md:text-lg">{para}</p>
            </Reveal>
          ))}

          <Reveal delay={0.1}>
            <div className="mt-10">
              <h3 className="font-mono text-sm uppercase tracking-wide text-accent-cyan">Education</h3>
              <ul className="mt-4 space-y-4">
                {education.map((edu) => (
                  <li
                    key={edu.degree}
                    className="flex flex-col justify-between gap-1 border-l-2 border-white/10 pl-4 sm:flex-row sm:items-baseline"
                  >
                    <div>
                      <p className="font-medium text-white">{edu.degree}</p>
                      <p className="text-sm text-white/55">{edu.institution}</p>
                    </div>
                    <p className="shrink-0 font-mono text-sm text-white/45">
                      {edu.score} · {edu.period}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
