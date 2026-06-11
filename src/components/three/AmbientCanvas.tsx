import { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleField } from './ParticleField';
import { usePointer } from '@/hooks/usePointer';

/**
 * A fixed, full-viewport particle field that lives behind ALL content — the
 * "ambient 3D throughout" layer. It's intentionally cheap: points only, no
 * postprocessing, capped DPR. It parallaxes with the shared cursor so the whole
 * page feels like it has depth as you scroll.
 *
 * Battery/perf: we stop the render loop whenever the tab is hidden.
 */
export function AmbientCanvas() {
  const pointer = usePointer();
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    [],
  );

  // Pause rendering when the tab isn't visible.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 8], fov: 60 }}
      >
        <ParticleField count={isMobile ? 260 : 700} pointer={pointer} />
      </Canvas>
    </div>
  );
}
