/**
 * Fragment shader for the hero sphere.
 *
 * Two ingredients:
 *  1. A base colour interpolated by how far the vertex was displaced, so peaks
 *     and troughs read as different hues (depth without lighting).
 *  2. A Fresnel rim: surfaces seen at a grazing angle glow, which — combined
 *     with the postprocessing Bloom pass — gives the "energy orb" look.
 */
export const sphereFragmentShader = /* glsl */ `
  uniform vec3 uColorA; // trough / core colour
  uniform vec3 uColorB; // peak colour
  uniform vec3 uColorRim; // fresnel rim colour

  varying float vDistort;
  varying vec3  vNormal;
  varying vec3  vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel term: 0 facing the camera, ->1 at the silhouette edge.
    float fresnel = pow(1.0 - clamp(dot(viewDir, vNormal), 0.0, 1.0), 2.5);

    // Colour by displacement, then add the rim glow on top.
    vec3 base = mix(uColorA, uColorB, smoothstep(-0.35, 0.6, vDistort));
    vec3 color = base + uColorRim * fresnel;

    gl_FragColor = vec4(color, 1.0);

    // Three.js include: converts linear -> sRGB so colours match the CSS palette.
    #include <colorspace_fragment>
  }
`;
