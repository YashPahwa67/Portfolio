import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { HeroSphere } from './HeroSphere';
import { ParticleField } from './ParticleField';
import { Avatar } from './Avatar';
import { usePointer } from '@/hooks/usePointer';
import type { AvatarConfig } from '@/types';

interface SceneProps {
  /** When false the render loop is suspended (hero scrolled out of view). */
  active: boolean;
  /** If `avatar.url` is set, the avatar replaces the orb as the centrepiece. */
  avatar: AvatarConfig;
}

/**
 * The WebGL hero scene. Lazy-loaded (see Hero.tsx) so Three.js never blocks
 * first paint, and only mounted when the visitor hasn't requested reduced motion.
 *
 * Performance strategy (we picked perf over polish where they conflicted):
 *  - `frameloop` flips to "never" when the hero leaves the viewport: zero GPU
 *    cost while reading the rest of the page.
 *  - `dpr` starts capped at 2 and PerformanceMonitor drops it to 1 if frames
 *    dip, so weak GPUs stay smooth.
 *  - On small screens we cut sphere detail / particle count and skip the
 *    Bloom + Vignette passes — postprocessing is the heaviest part, least missed
 *    on a phone.
 */
export default function Scene({ active, avatar }: SceneProps) {
  const pointer = usePointer();
  const useAvatar = avatar.url.trim().length > 0;

  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    [],
  );
  const [dpr, setDpr] = useState<number>(isMobile ? 1.5 : 2);

  return (
    <Canvas
      // Decorative: kept out of the accessibility tree and the tab order.
      aria-hidden
      tabIndex={-1}
      className="!pointer-events-none"
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      // Avatar busts want a tighter, eye-level framing; the orb wants room to breathe.
      camera={{ position: useAvatar ? [0, 0.1, 5] : [0, 0, 4.2], fov: useAvatar ? 30 : 45 }}
    >
      {/* Drops resolution one notch if the GPU can't hold frame rate. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} />

      {/* Lights only affect the avatar's PBR materials; the orb/particles are
          self-lit shaders, so this is free for the fallback path. The coloured
          point lights paint cyan/violet rim light that the Bloom pass picks up. */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight position={[-4, 1, 2]} intensity={30} color="#22d3ee" />
      <pointLight position={[4, -1, 3]} intensity={22} color="#a855f7" />

      <Suspense fallback={null}>
        {useAvatar ? (
          <Avatar config={avatar} pointer={pointer} />
        ) : (
          <HeroSphere detail={isMobile ? 12 : 24} pointer={pointer} />
        )}
        <ParticleField count={isMobile ? 500 : 1400} pointer={pointer} />

        {/* Postprocessing is desktop-only — it's the heaviest pass by far. */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.85}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.7}
            />
            <Vignette eskil={false} offset={0.25} darkness={0.7} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
