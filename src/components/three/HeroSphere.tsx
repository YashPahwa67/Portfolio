import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { sphereVertexShader } from './shaders/sphere.vert';
import { sphereFragmentShader } from './shaders/sphere.frag';

interface HeroSphereProps {
  /** Icosphere subdivision level. Higher = smoother displacement, more verts. */
  detail?: number;
  /** Shared, window-level normalized pointer (-1..1) for cursor reactivity. */
  pointer: RefObject<THREE.Vector2>;
}

/**
 * The hero centrepiece: a noise-displaced icosphere with a fresnel glow.
 *
 * - Geometry: an icosahedron subdivided `detail` times → a near-perfect sphere
 *   with evenly distributed vertices (better than a UV sphere for displacement).
 * - Material: our custom shader (see ./shaders). We update its uniforms every
 *   frame: `uTime` advances the noise field; `uMouse` eases toward the cursor.
 * - <Float> adds a gentle, organic bob so it never feels static.
 */
export function HeroSphere({ detail = 20, pointer }: HeroSphereProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  // Reused scratch vector so we don't allocate inside the render loop.
  const mouseTarget = useRef(new THREE.Vector3());

  // Uniforms are created once. Colours map to the site's cyan→indigo→violet ramp.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistort: { value: 0.45 },
      uFrequency: { value: 1.35 },
      uMouse: { value: new THREE.Vector3() },
      uColorA: { value: new THREE.Color('#4338ca') }, // indigo core
      uColorB: { value: new THREE.Color('#22d3ee') }, // cyan peaks
      uColorRim: { value: new THREE.Color('#a855f7') }, // violet rim glow
    }),
    [],
  );

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    // Clamp delta so a backgrounded tab doesn't jump the animation on resume.
    mat.uniforms.uTime.value += Math.min(delta, 1 / 30);

    // Ease the cursor uniform toward the live pointer for a smooth, weighty feel.
    const p = pointer.current;
    if (p) {
      mouseTarget.current.set(p.x, p.y, 0.6);
      (mat.uniforms.uMouse.value as THREE.Vector3).lerp(mouseTarget.current, 0.05);
    }

    // Slow self-rotation adds parallax against the floating motion.
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.7}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, detail]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={sphereVertexShader}
          fragmentShader={sphereFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </Float>
  );
}
