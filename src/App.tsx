import { Suspense, lazy } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Expertise } from '@/components/sections/Expertise';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

// Lazy so the (heavy) Three.js bundle loads AFTER first paint, never blocking it.
const AmbientCanvas = lazy(() =>
  import('@/components/three/AmbientCanvas').then((m) => ({ default: m.AmbientCanvas })),
);

/**
 * Page composition. Note the ordering of concerns:
 *  - A keyboard "skip to content" link is the very first focusable element.
 *  - The ambient WebGL backdrop is only mounted when motion is allowed; under
 *    prefers-reduced-motion the entire site is a calm, static document.
 *  - All real content lives in semantic <main>/<section> landmarks so the 3D
 *    never interferes with screen-reader or keyboard navigation.
 */
export default function App() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      {!reducedMotion && (
        <Suspense fallback={null}>
          <AmbientCanvas />
        </Suspense>
      )}

      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Expertise />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
