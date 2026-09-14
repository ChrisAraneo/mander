import {
  BLOOM_AMOUNT,
  BLOOM_RADIUS,
  BLOOM_THRESHOLD,
  CEL_BANDS,
  CEL_MIX,
  CEL_SATURATION,
  CHROMA_BLEED,
  CHROMA_LAG,
  CHROMA_SPLIT,
  EDGE_BAND_START,
  EDGE_BAND_WANDER,
  EDGE_BAND_WANDER_PITCH,
  EDGE_GLOW_AMOUNT,
  EDGE_GLOW_RADIUS,
  EDGE_SHADOW_DEPTH,
  EDGE_SHADOW_START,
  EXPOSURE,
  GLOW_AMOUNT,
  GLOW_RADIUS,
  HIGHLIGHT_TINT,
  INK_COLOR,
  INK_JITTER,
  INK_SOFTNESS,
  INK_STRENGTH,
  INK_THRESHOLD,
  MASK_DEPTH,
  PAPER_FIBRE,
  PAPER_FIBRE_PITCH,
  PAPER_GRAIN,
  SCANLINE_DEPTH,
  SCANLINE_PITCH,
  SCREENTONE_DEPTH,
  SCREENTONE_DRIFT,
  SCREENTONE_PITCH,
  SHADOW_TINT,
  TAPE_CLUMP,
  TAPE_CLUMP_PITCH,
  TAPE_GRAIN,
  VIGNETTE,
} from './consts';

const formatGlslFloat = (value: number): string => value.toFixed(4);

const formatGlslVec3 = (value: readonly [number, number, number]): string =>
  `vec3(${value.map(formatGlslFloat).join(', ')})`;

export const FRAGMENT_SOURCE = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform vec2 uResolution;
uniform float uScale;

out vec4 fragColor;

const float PI = 3.1415927;

const float CEL_BANDS = ${formatGlslFloat(CEL_BANDS)};
const float CEL_MIX = ${formatGlslFloat(CEL_MIX)};
const float CEL_SATURATION = ${formatGlslFloat(CEL_SATURATION)};
const vec3 SHADOW_TINT = ${formatGlslVec3(SHADOW_TINT)};
const vec3 HIGHLIGHT_TINT = ${formatGlslVec3(HIGHLIGHT_TINT)};
const vec3 INK_COLOR = ${formatGlslVec3(INK_COLOR)};
const float INK_STRENGTH = ${formatGlslFloat(INK_STRENGTH)};
const float INK_THRESHOLD = ${formatGlslFloat(INK_THRESHOLD)};
const float INK_SOFTNESS = ${formatGlslFloat(INK_SOFTNESS)};
const float INK_JITTER = ${formatGlslFloat(INK_JITTER)};

const float CHROMA_SPLIT = ${formatGlslFloat(CHROMA_SPLIT)};
const float CHROMA_BLEED = ${formatGlslFloat(CHROMA_BLEED)};
const float CHROMA_LAG = ${formatGlslFloat(CHROMA_LAG)};
const float TAPE_GRAIN = ${formatGlslFloat(TAPE_GRAIN)};
const float TAPE_CLUMP = ${formatGlslFloat(TAPE_CLUMP)};
const float TAPE_CLUMP_PITCH = ${formatGlslFloat(TAPE_CLUMP_PITCH)};
const float PAPER_GRAIN = ${formatGlslFloat(PAPER_GRAIN)};
const float PAPER_FIBRE = ${formatGlslFloat(PAPER_FIBRE)};
const float PAPER_FIBRE_PITCH = ${formatGlslFloat(PAPER_FIBRE_PITCH)};
const float SCREENTONE_DEPTH = ${formatGlslFloat(SCREENTONE_DEPTH)};
const float SCREENTONE_PITCH = ${formatGlslFloat(SCREENTONE_PITCH)};
const float SCREENTONE_DRIFT = ${formatGlslFloat(SCREENTONE_DRIFT)};

const float EDGE_BAND_START = ${formatGlslFloat(EDGE_BAND_START)};
const float EDGE_BAND_WANDER = ${formatGlslFloat(EDGE_BAND_WANDER)};
const float EDGE_BAND_WANDER_PITCH = ${formatGlslFloat(EDGE_BAND_WANDER_PITCH)};
const float EDGE_SHADOW_START = ${formatGlslFloat(EDGE_SHADOW_START)};
const float EDGE_SHADOW_DEPTH = ${formatGlslFloat(EDGE_SHADOW_DEPTH)};
const float EDGE_GLOW_AMOUNT = ${formatGlslFloat(EDGE_GLOW_AMOUNT)};
const float EDGE_GLOW_RADIUS = ${formatGlslFloat(EDGE_GLOW_RADIUS)};

const float SCANLINE_DEPTH = ${formatGlslFloat(SCANLINE_DEPTH)};
const float SCANLINE_PITCH = ${formatGlslFloat(SCANLINE_PITCH)};
const float MASK_DEPTH = ${formatGlslFloat(MASK_DEPTH)};
const float BLOOM_AMOUNT = ${formatGlslFloat(BLOOM_AMOUNT)};
const float BLOOM_RADIUS = ${formatGlslFloat(BLOOM_RADIUS)};
const float BLOOM_THRESHOLD = ${formatGlslFloat(BLOOM_THRESHOLD)};
const float GLOW_AMOUNT = ${formatGlslFloat(GLOW_AMOUNT)};
const float GLOW_RADIUS = ${formatGlslFloat(GLOW_RADIUS)};
const float VIGNETTE = ${formatGlslFloat(VIGNETTE)};
const float EXPOSURE = ${formatGlslFloat(EXPOSURE)};

float hash(vec2 seed) {
  uvec2 cell = uvec2(ivec2(floor(seed)) + 65536);
  uint value = cell.x * 73856093u ^ cell.y * 19349663u;

  value ^= value >> 13u;
  value *= 0x85ebca6bu;
  value ^= value >> 16u;

  return float(value & 0xffffffu) / float(0xffffffu);
}

float sampleValueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 offset = fract(point);
  vec2 blend = offset * offset * (3.0 - 2.0 * offset);

  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
    blend.y);
}

float sampleMottle(vec2 point) {
  mat2 turn = mat2(0.8776, 0.4794, -0.4794, 0.8776);

  return sampleValueNoise(point) * 0.62 + sampleValueNoise(turn * point * 2.17) * 0.38;
}

float computeLuma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 sampleScene(vec2 uv) {
  return texture(uScene, clamp(uv, vec2(0.0), vec2(1.0))).rgb;
}

float computeEdgeAmount(vec2 centred, float wander) {
  return smoothstep(EDGE_BAND_START, 1.0, max(centred.x, centred.y) + wander);
}

float computeEdgeShade(vec2 centred) {
  return 1.0 - EDGE_SHADOW_DEPTH
    * smoothstep(EDGE_SHADOW_START, 1.0, max(centred.x, centred.y));
}

vec3 sampleTapeColor(vec2 uv, vec2 pixel) {
  vec3 split = vec3(
    sampleScene(uv - vec2(CHROMA_SPLIT * pixel.x, 0.0)).r,
    sampleScene(uv).g,
    sampleScene(uv + vec2(CHROMA_SPLIT * pixel.x, 0.0)).b);
  vec3 smeared = vec3(0.0);

  for (int tap = 1; tap <= 4; tap++) {
    smeared += sampleScene(uv + vec2(float(tap) * 0.25 * CHROMA_BLEED * pixel.x, 0.0));
  }

  smeared *= 0.25;

  return vec3(computeLuma(split))
    + mix(split - vec3(computeLuma(split)), smeared - vec3(computeLuma(smeared)), CHROMA_LAG);
}

float detectInkEdge(vec2 uv, vec2 pixel) {
  float topLeft = computeLuma(sampleScene(uv + vec2(-pixel.x, pixel.y)));
  float top = computeLuma(sampleScene(uv + vec2(0.0, pixel.y)));
  float topRight = computeLuma(sampleScene(uv + pixel));
  float left = computeLuma(sampleScene(uv - vec2(pixel.x, 0.0)));
  float right = computeLuma(sampleScene(uv + vec2(pixel.x, 0.0)));
  float bottomLeft = computeLuma(sampleScene(uv - pixel));
  float bottom = computeLuma(sampleScene(uv - vec2(0.0, pixel.y)));
  float bottomRight = computeLuma(sampleScene(uv + vec2(pixel.x, -pixel.y)));

  return length(vec2(
    (topLeft + 2.0 * left + bottomLeft) - (topRight + 2.0 * right + bottomRight),
    (topLeft + 2.0 * top + topRight) - (bottomLeft + 2.0 * bottom + bottomRight)));
}

vec3 computeGlow(vec2 uv, vec2 pixel) {
  vec3 sum = vec3(0.0);

  for (int tap = 0; tap < 8; tap++) {
    float angle = float(tap) * (PI / 4.0) + 0.4;
    float radius = GLOW_RADIUS * (tap % 2 == 0 ? 1.0 : 0.55);

    sum += sampleScene(uv + vec2(cos(angle), sin(angle)) * radius * pixel);
  }

  return sum * (GLOW_AMOUNT / 8.0);
}

vec3 computeDarkGlow(vec2 uv, vec2 pixel, float amount) {
  vec3 sum = vec3(0.0);

  for (int tap = 0; tap < 8; tap++) {
    float angle = float(tap) * (PI / 4.0) + 1.2;
    float radius = EDGE_GLOW_RADIUS * (tap % 2 == 0 ? 1.0 : 0.55);

    sum += sampleScene(uv + vec2(cos(angle), sin(angle)) * radius * pixel);
  }

  return sum * (EDGE_GLOW_AMOUNT * amount / 8.0);
}

vec3 computeBloom(vec2 uv, vec2 pixel) {
  vec3 glow = vec3(0.0);

  for (int tap = 0; tap < 6; tap++) {
    float angle = float(tap) * (PI / 3.0);
    vec2 offset = vec2(cos(angle), sin(angle)) * BLOOM_RADIUS * pixel;

    glow += max(sampleScene(uv + offset) - vec3(BLOOM_THRESHOLD), vec3(0.0));
  }

  return glow * (BLOOM_AMOUNT / 6.0);
}

vec3 applyCel(vec3 color) {
  float level = computeLuma(color);
  float banded = floor(level * CEL_BANDS + 0.5) / CEL_BANDS;
  vec3 flattened = color * min(mix(1.0, banded / max(level, 0.0001), CEL_MIX), 3.0);

  return mix(vec3(computeLuma(flattened)), flattened, CEL_SATURATION)
    * mix(SHADOW_TINT, HIGHLIGHT_TINT, clamp(computeLuma(flattened) * 1.2, 0.0, 1.0));
}

float computeScanlines(float row) {
  float pitch = max(2.0, floor(uScale * SCANLINE_PITCH + 0.5));

  return 1.0 - SCANLINE_DEPTH * pow(sin(row * PI / pitch), 2.0);
}

vec3 applyStock(vec3 color, vec2 uv, vec2 virtualPixel) {
  float blotch = sampleMottle(uv * vec2(60.0, 40.0));
  float fibre = sampleMottle(virtualPixel / PAPER_FIBRE_PITCH) - 0.5;

  return color * (1.0 - PAPER_GRAIN * blotch) * (1.0 + PAPER_FIBRE * fibre);
}

float computeGrain(vec2 virtualPixel) {
  return (hash(gl_FragCoord.xy) - 0.5) * TAPE_GRAIN
    + (sampleMottle(virtualPixel / TAPE_CLUMP_PITCH) - 0.5) * TAPE_CLUMP;
}

vec3 applyScreentone(vec3 color, vec2 virtualPixel) {
  vec2 drift = (vec2(
    sampleMottle(virtualPixel / 40.0),
    sampleMottle(virtualPixel / 40.0 + 17.3)) - 0.5) * SCREENTONE_DRIFT * uScale;
  vec2 cell = (gl_FragCoord.xy + drift)
    / max(2.0, floor(uScale * SCREENTONE_PITCH + 0.5));
  vec2 turned = vec2(cell.x + cell.y, cell.y - cell.x) * 0.70711;
  float dots = sin(turned.x * PI) * sin(turned.y * PI);
  float level = computeLuma(color);

  return color
    * (1.0 + SCREENTONE_DEPTH * clamp(4.0 * level * (1.0 - level), 0.0, 1.0) * dots);
}

vec3 computeShadowMask(float column) {
  vec3 mask = vec3(1.0 - MASK_DEPTH);

  mask[int(mod(column, 3.0))] = 1.0 + MASK_DEPTH;

  return mask;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 pixel = vec2(uScale) / uResolution;
  vec2 virtualPixel = uv / pixel;
  vec2 centred = abs(uv * 2.0 - 1.0);

  float wander = (sampleMottle(virtualPixel / EDGE_BAND_WANDER_PITCH) - 0.5)
    * EDGE_BAND_WANDER;
  float band = computeEdgeAmount(centred, wander);

  vec2 jitterSeed = uv * vec2(24.0, 12.0);
  vec2 jitter = (vec2(sampleValueNoise(jitterSeed), sampleValueNoise(jitterSeed + 31.7)) - 0.5)
    * INK_JITTER;

  vec3 picture = sampleTapeColor(uv, pixel);
  vec3 color = applyCel(picture) + computeBloom(uv, pixel) + computeGlow(uv, pixel);
  float ink = smoothstep(
    INK_THRESHOLD,
    INK_THRESHOLD + INK_SOFTNESS,
    detectInkEdge(uv + jitter * pixel, pixel)) * INK_STRENGTH;

  color = mix(color, INK_COLOR, ink);
  color = applyScreentone(applyStock(color, uv, virtualPixel), virtualPixel);
  color += computeGrain(virtualPixel) * mix(1.5, 0.4, computeLuma(color));

  color *= EXPOSURE;
  color *= computeScanlines(gl_FragCoord.y);
  color *= computeShadowMask(gl_FragCoord.x);
  color *= 1.0 - VIGNETTE * 0.5 * dot(uv * 2.0 - 1.0, uv * 2.0 - 1.0);
  color *= computeEdgeShade(centred);
  color -= computeDarkGlow(uv, pixel, band);

  fragColor = vec4(clamp(color, vec3(0.0), vec3(1.0)), 1.0);
}
`;
