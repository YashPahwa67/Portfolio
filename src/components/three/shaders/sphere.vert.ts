/**
 * Vertex shader for the hero sphere.
 *
 * Idea: take an icosphere and push each vertex along its normal by a value
 * sampled from 3D simplex noise. Animating the noise field over time makes the
 * surface roil like liquid metal; a cursor-driven term bulges the side facing
 * the pointer so the object feels "alive" and reactive.
 *
 * The simplex noise implementation below is the well-known GLSL port by
 * Ian McEwan / Stefan Gustavson (Ashima Arts) — public domain / MIT.
 * We keep it inline so the project needs no GLSL build plugin.
 */
export const sphereVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDistort;    // displacement amplitude
  uniform float uFrequency;  // spatial frequency of the noise
  uniform vec3  uMouse;      // normalized cursor direction in object space

  varying float vDistort;    // pass displacement to the fragment for colouring
  varying vec3  vNormal;
  varying vec3  vViewPosition;

  // --- Ashima simplex noise (snoise) -------------------------------------
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
  // -----------------------------------------------------------------------

  void main() {
    // Animated base field: slowly evolving organic ripples across the surface.
    float noise = snoise(position * uFrequency + vec3(uTime * 0.25));

    // Cursor influence: vertices facing the pointer (dot ~ 1) bulge outward.
    // Adding a tiny epsilon avoids normalizing a zero vector on first frame.
    float mouseFacing = dot(normalize(position), normalize(uMouse + 0.0001));
    float displacement = (noise + mouseFacing * 0.4) * uDistort;

    vec3 displaced = position + normal * displacement;

    vDistort = displacement;
    // Note: we reuse the *base* normal here. Re-deriving the true displaced
    // normal (via neighbour sampling) is several extra noise() calls per vertex;
    // for a glow/fresnel look the approximation is visually indistinguishable,
    // so we trade exactness for frame budget — a deliberate perf choice.
    vNormal = normalize(normalMatrix * normal);

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
