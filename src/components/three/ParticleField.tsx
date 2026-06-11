import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  /** Number of particles. Tuned down on mobile for fill-rate. */
  count?: number;
  pointer: RefObject<THREE.Vector2>;
}

/**
 * Ambient depth: a slowly rotating cloud of additive points surrounding the
 * sphere. It drifts on its own and parallaxes toward the cursor, giving the
 * hero a sense of 3D space without any extra geometry cost.
 */
export function ParticleField({ count = 1400, pointer }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Distribute points uniformly in a spherical shell (not a cube) so the cloud
  // reads as a halo around the centrepiece. Computed once.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4.5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      // acos(2u-1) gives a uniform distribution over the sphere (avoids polar clumping).
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const group = pointsRef.current;
    if (!group) return;
    group.rotation.y += delta * 0.02;
    const p = pointer.current;
    if (p) {
      // Lerp toward a small pointer-driven tilt for subtle parallax.
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, p.y * 0.12, 0.03);
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -p.x * 0.12, 0.03);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#9aa5ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false} // additive points shouldn't occlude each other
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
