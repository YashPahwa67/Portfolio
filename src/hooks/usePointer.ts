import { useEffect, useRef, type RefObject } from 'react';
import { Vector2 } from 'three';

/**
 * A single, app-wide normalized pointer (-1..1 on each axis).
 *
 * Both WebGL canvases (the hero scene and the ambient field) read from this same
 * vector, so we attach exactly one window-level `pointermove` listener no matter
 * how many components subscribe. Reading from `window` (not a canvas) means the
 * 3D keeps reacting even while the cursor is over foreground text.
 */
const sharedPointer = new Vector2(0, 0);
let listenerCount = 0;

function handleMove(e: PointerEvent): void {
  sharedPointer.set(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1,
  );
}

export function usePointer(): RefObject<Vector2> {
  const ref = useRef<Vector2>(sharedPointer);

  useEffect(() => {
    if (listenerCount === 0) {
      window.addEventListener('pointermove', handleMove, { passive: true });
    }
    listenerCount += 1;
    return () => {
      listenerCount -= 1;
      if (listenerCount === 0) window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return ref;
}
