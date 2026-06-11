import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { AvatarConfig } from '@/types';

interface AvatarProps {
  config: AvatarConfig;
  /** Shared window pointer for head/eye tracking. */
  pointer: RefObject<THREE.Vector2>;
}

/**
 * Loads a 3D avatar (.glb — designed around Ready Player Me rigs) and makes it
 * feel present: the head and eyes ease toward the cursor, and <Float> adds a
 * subtle idle sway so it never looks frozen.
 *
 * Ready Player Me bones are named "Head", "LeftEye", "RightEye" — we look those
 * up once after load and rotate them in the frame loop. A half-body avatar is
 * recommended (no T-posed arms to deal with); `scale`/`position` frame the bust.
 */
export function Avatar({ config, pointer }: AvatarProps) {
  const { scene } = useGLTF(config.url);

  // Cached references to the bones we steer each frame.
  const head = useRef<THREE.Object3D | null>(null);
  const eyes = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    eyes.current = [];
    scene.traverse((obj) => {
      if (obj.name === 'Head') head.current = obj;
      if (obj.name === 'LeftEye' || obj.name === 'RightEye') eyes.current.push(obj);
      // Avatars often sit just outside the frustum during head turns — disabling
      // culling avoids the model flickering out at the edges.
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) mesh.frustumCulled = false;
    });
  }, [scene]);

  useFrame(() => {
    const p = pointer.current;
    if (!p) return;

    // Map pointer to gentle head rotation. Clamped implicitly by the small gains.
    const targetYaw = p.x * 0.5; // left/right
    const targetPitch = -p.y * 0.3; // up/down

    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, targetYaw, 0.08);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, targetPitch, 0.08);
    }
    // Eyes track a touch more than the head for a lifelike micro-saccade feel.
    for (const eye of eyes.current) {
      eye.rotation.y = THREE.MathUtils.lerp(eye.rotation.y, targetYaw * 0.6, 0.15);
      eye.rotation.x = THREE.MathUtils.lerp(eye.rotation.x, targetPitch * 0.6, 0.15);
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.35}>
      <primitive
        object={scene}
        scale={config.scale ?? 3}
        position={config.position ?? [0, -3.2, 0]}
      />
    </Float>
  );
}
