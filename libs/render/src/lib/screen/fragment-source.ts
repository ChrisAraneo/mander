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
  CORNER_SHARP_AMOUNT,
  CORNER_SHARP_FALLOFF,
  EDGE_BLUR_CUTOFF,
  EDGE_BLUR_RADIUS,
  EDGE_BLUR_START,
  EDGE_BLUR_STRETCH,
  EDGE_BLUR_WANDER,
  EDGE_BLUR_WANDER_PITCH,
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

/** GLSL has no integer literals for floats, so every constant needs a point. */
const glslFloat = (value: number): string => value.toFixed(4);

const glslVec3 = (value: readonly [number, number, number]): string =>
  `vec3(${value.map(glslFloat).join(', ')})`;

/**
 * One pass over the drawn frame. Reads as the signal path it imitates: the
 * cel is painted and inked, the lens softens its edges, the tape bleeds its
 * colour, the tube scans and blooms it.
 *
 * Every term is a function of the fragment's position only — there is no time
 * uniform — so a still game is a still picture.
 */
export const FRAGMENT_SOURCE = `#version 300 es
precision highp float;

uniform sampler2D uScene;
/** Display size in device pixels. */
uniform vec2 uResolution;
/** Device pixels per virtual (960x480) pixel. */
uniform float uScale;

out vec4 fragColor;

const float PI = 3.1415927;

const float CEL_BANDS = ${glslFloat(CEL_BANDS)};
const float CEL_MIX = ${glslFloat(CEL_MIX)};
const float CEL_SATURATION = ${glslFloat(CEL_SATURATION)};
const vec3 SHADOW_TINT = ${glslVec3(SHADOW_TINT)};
const vec3 HIGHLIGHT_TINT = ${glslVec3(HIGHLIGHT_TINT)};
const vec3 INK_COLOR = ${glslVec3(INK_COLOR)};
const float INK_STRENGTH = ${glslFloat(INK_STRENGTH)};
const float INK_THRESHOLD = ${glslFloat(INK_THRESHOLD)};
const float INK_SOFTNESS = ${glslFloat(INK_SOFTNESS)};
const float INK_JITTER = ${glslFloat(INK_JITTER)};

const float CHROMA_SPLIT = ${glslFloat(CHROMA_SPLIT)};
const float CHROMA_BLEED = ${glslFloat(CHROMA_BLEED)};
const float CHROMA_LAG = ${glslFloat(CHROMA_LAG)};
const float TAPE_GRAIN = ${glslFloat(TAPE_GRAIN)};
const float TAPE_CLUMP = ${glslFloat(TAPE_CLUMP)};
const float TAPE_CLUMP_PITCH = ${glslFloat(TAPE_CLUMP_PITCH)};
const float PAPER_GRAIN = ${glslFloat(PAPER_GRAIN)};
const float PAPER_FIBRE = ${glslFloat(PAPER_FIBRE)};
const float PAPER_FIBRE_PITCH = ${glslFloat(PAPER_FIBRE_PITCH)};
const float SCREENTONE_DEPTH = ${glslFloat(SCREENTONE_DEPTH)};
const float SCREENTONE_PITCH = ${glslFloat(SCREENTONE_PITCH)};
const float SCREENTONE_DRIFT = ${glslFloat(SCREENTONE_DRIFT)};

const float EDGE_BLUR_START = ${glslFloat(EDGE_BLUR_START)};
const float EDGE_BLUR_RADIUS = ${glslFloat(EDGE_BLUR_RADIUS)};
const float EDGE_BLUR_CUTOFF = ${glslFloat(EDGE_BLUR_CUTOFF)};
const float CORNER_SHARP_AMOUNT = ${glslFloat(CORNER_SHARP_AMOUNT)};
const float CORNER_SHARP_FALLOFF = ${glslFloat(CORNER_SHARP_FALLOFF)};
const float EDGE_BLUR_STRETCH = ${glslFloat(EDGE_BLUR_STRETCH)};
const float EDGE_BLUR_WANDER = ${glslFloat(EDGE_BLUR_WANDER)};
const float EDGE_BLUR_WANDER_PITCH = ${glslFloat(EDGE_BLUR_WANDER_PITCH)};
const float EDGE_SHADOW_START = ${glslFloat(EDGE_SHADOW_START)};
const float EDGE_SHADOW_DEPTH = ${glslFloat(EDGE_SHADOW_DEPTH)};
const float EDGE_GLOW_AMOUNT = ${glslFloat(EDGE_GLOW_AMOUNT)};
const float EDGE_GLOW_RADIUS = ${glslFloat(EDGE_GLOW_RADIUS)};
/** Ring spacing of the blur kernel, in units of sigma. */
const float RING_STEP = 0.75;

const float SCANLINE_DEPTH = ${glslFloat(SCANLINE_DEPTH)};
const float SCANLINE_PITCH = ${glslFloat(SCANLINE_PITCH)};
const float MASK_DEPTH = ${glslFloat(MASK_DEPTH)};
const float BLOOM_AMOUNT = ${glslFloat(BLOOM_AMOUNT)};
const float BLOOM_RADIUS = ${glslFloat(BLOOM_RADIUS)};
const float BLOOM_THRESHOLD = ${glslFloat(BLOOM_THRESHOLD)};
const float GLOW_AMOUNT = ${glslFloat(GLOW_AMOUNT)};
const float GLOW_RADIUS = ${glslFloat(GLOW_RADIUS)};
const float VIGNETTE = ${glslFloat(VIGNETTE)};
const float EXPOSURE = ${glslFloat(EXPOSURE)};

/**
 * An integer hash rather than the usual fract(sin(dot(...))) trick. The sin
 * version repeats along diagonals and bands visibly on some drivers, which is
 * exactly the regularity grain is there to break up.
 */
float hash(vec2 seed) {
  uvec2 cell = uvec2(ivec2(floor(seed)) + 65536);
  uint value = cell.x * 73856093u ^ cell.y * 19349663u;

  value ^= value >> 13u;
  value *= 0x85ebca6bu;
  value ^= value >> 16u;

  return float(value & 0xffffffu) / float(0xffffffu);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 offset = fract(point);
  vec2 blend = offset * offset * (3.0 - 2.0 * offset);

  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
    blend.y);
}

/**
 * Two octaves of noise at an irrational frequency ratio, the second turned off
 * axis, so neither octave's cell grid lines up with the other or with the
 * pixel grid. A single octave of value noise reads as a lattice; this does not.
 */
float mottle(vec2 point) {
  mat2 turn = mat2(0.8776, 0.4794, -0.4794, 0.8776);

  return valueNoise(point) * 0.62 + valueNoise(turn * point * 2.17) * 0.38;
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 scene(vec2 uv) {
  return texture(uScene, clamp(uv, vec2(0.0), vec2(1.0))).rgb;
}

/**
 * 0 through the middle of the picture, 1 at any of its four edges.
 *
 * The wander shifts the whole ramp in or out, so the band's inner boundary is
 * a slow wave rather than a ruled line. It is added to the distance rather
 * than to the result so the boundary moves without the band changing depth.
 */
float edgeAmount(vec2 centred, float wander) {
  return smoothstep(EDGE_BLUR_START, 1.0, max(centred.x, centred.y) + wander);
}

/**
 * How much of the edge blur to take back out: 0 along both centre lines and
 * at the middle of every edge, rising to 1 in the corners themselves.
 *
 * It multiplies the two axis distances rather than taking a radius, because a
 * radius cannot tell a corner from the middle of an edge until the last third
 * of its range — the middle of an edge is already 0.71 of the way out. The
 * product is 0 there and 1 only where both axes are extreme, which is exactly
 * the region the two edge bands overlap in.
 */
float cornerClear(vec2 centred) {
  return CORNER_SHARP_AMOUNT
    * pow(clamp(centred.x * centred.y, 0.0, 1.0), CORNER_SHARP_FALLOFF);
}

/**
 * The shade around the border, on its own ramp so it can sit tighter to the
 * edge than the softening does. It takes the distance to the nearest border,
 * not a radius, so the frame it draws is even the whole way around instead of
 * pooling in the corners the way the vignette does.
 */
float edgeShade(vec2 centred) {
  return 1.0 - EDGE_SHADOW_DEPTH
    * smoothstep(EDGE_SHADOW_START, 1.0, max(centred.x, centred.y));
}

/**
 * Share of a Gaussian's volume lying between two radii, both in units of
 * sigma. This is the integral of exp(-r^2 / 2) r dr over the annulus, which
 * is what each ring of taps has to carry for the rings to add up to a
 * Gaussian rather than to a flat disc.
 */
float ringWeight(float inner, float outer) {
  return exp(-0.5 * inner * inner) - exp(-0.5 * outer * outer);
}

/**
 * Three rings of taps weighted onto a Gaussian: the spread is the sigma, each
 * ring sits one RING_STEP further out and carries its own share of the
 * Gaussian's volume. Weighting the rings equally instead would be a flat disc
 * blur, which smears detail into a doughnut rather than softening it.
 *
 * The outermost ring reaches 2.6 sigma, which is 97% of the Gaussian's volume
 * — the tail beyond it is below the grain.
 *
 * The kernel is stretched along axis, so the picture is pulled toward the
 * border rather than spread evenly around each point, and the whole tap
 * pattern is turned by a per-pixel random angle. Without that turn the taps
 * land on the same eight bearings for every fragment, and the kernel prints
 * its own eight-armed rosette around bright detail; with it the error becomes
 * noise, which is what the rest of the stage is made of anyway.
 */
vec3 gaussianBlur(vec2 uv, vec2 pixel, float spread, vec2 axis) {
  float sigma = max(spread, 0.0001);
  // A quarter turn covers the kernel's whole rotational symmetry — eight taps
  // at PI/4 apart repeat beyond that, so a wider range would buy nothing.
  float dither = hash(gl_FragCoord.xy) * (PI / 4.0);
  // The centre tap stands only for the small disc out to half a ring spacing,
  // which is about 7% of the kernel. Giving it weight 1 like the rings would
  // leave a sharp core inside a soft halo — a ghost, not a blur.
  float middle = ringWeight(0.0, RING_STEP * 0.5);
  vec3 sum = scene(uv) * middle;
  float total = middle;

  for (int ring = 1; ring <= 3; ring++) {
    float centre = float(ring) * RING_STEP;
    float weight = ringWeight(centre - RING_STEP * 0.5, centre + RING_STEP * 0.5);
    // Each ring is turned against the last so the taps do not line up into
    // spokes at the wider spreads.
    float twist = float(ring) * 0.35 + dither;

    // Eight taps rather than six: at the full edge sigma the outer ring is
    // wide enough that six of them sample a virtual pixel apart, and the gaps
    // between them come back as a faint rosette around bright detail.
    for (int tap = 0; tap < 8; tap++) {
      float angle = float(tap) * (PI / 4.0) + twist;
      vec2 offset = vec2(cos(angle), sin(angle)) * centre * sigma;

      // Lengthen the part of the offset lying along the axis and leave the
      // part across it alone, which stretches the kernel rather than turning
      // or growing it.
      offset += axis * dot(offset, axis) * EDGE_BLUR_STRETCH;

      sum += scene(uv + offset * pixel) * (weight / 8.0);
    }

    total += weight;
  }

  return sum / total;
}

/** Luma stays sharp, chroma smears to the right — the tape's signature. */
vec3 tapeColor(vec2 uv, vec2 pixel) {
  vec3 split = vec3(
    scene(uv - vec2(CHROMA_SPLIT * pixel.x, 0.0)).r,
    scene(uv).g,
    scene(uv + vec2(CHROMA_SPLIT * pixel.x, 0.0)).b);
  vec3 smeared = vec3(0.0);

  for (int tap = 1; tap <= 4; tap++) {
    smeared += scene(uv + vec2(float(tap) * 0.25 * CHROMA_BLEED * pixel.x, 0.0));
  }

  smeared *= 0.25;

  return vec3(luma(split))
    + mix(split - vec3(luma(split)), smeared - vec3(luma(smeared)), CHROMA_LAG);
}

/** Sobel over the drawn frame — the ink line a cel would have been drawn with. */
float inkEdge(vec2 uv, vec2 pixel) {
  float topLeft = luma(scene(uv + vec2(-pixel.x, pixel.y)));
  float top = luma(scene(uv + vec2(0.0, pixel.y)));
  float topRight = luma(scene(uv + pixel));
  float left = luma(scene(uv - vec2(pixel.x, 0.0)));
  float right = luma(scene(uv + vec2(pixel.x, 0.0)));
  float bottomLeft = luma(scene(uv - pixel));
  float bottom = luma(scene(uv - vec2(0.0, pixel.y)));
  float bottomRight = luma(scene(uv + vec2(pixel.x, -pixel.y)));

  return length(vec2(
    (topLeft + 2.0 * left + bottomLeft) - (topRight + 2.0 * right + bottomRight),
    (topLeft + 2.0 * top + topRight) - (bottomLeft + 2.0 * bottom + bottomRight)));
}

/**
 * Veiling glare: the glass itself glowing, so a broad average of the picture
 * is laid back over it. Wider than the bloom, far weaker, and not thresholded
 * — this lifts the whole frame instead of haloing the bright parts, which is
 * what a lit tube in a dark room actually does.
 */
vec3 glow(vec2 uv, vec2 pixel) {
  vec3 sum = vec3(0.0);

  for (int tap = 0; tap < 8; tap++) {
    float angle = float(tap) * (PI / 4.0) + 0.4;
    // Alternating radii: a single ring would end the halo abruptly at its own
    // radius, which reads as a faint outline rather than a glow.
    float radius = GLOW_RADIUS * (tap % 2 == 0 ? 1.0 : 0.55);

    sum += scene(uv + vec2(cos(angle), sin(angle)) * radius * pixel);
  }

  return sum * (GLOW_AMOUNT / 8.0);
}

/**
 * The same glare run backwards: around the border the glass drinks light
 * instead of giving it off. Because the shade is a broad average of the
 * picture rather than a flat grade, it pools where the border is bright and
 * all but vanishes where it is already dark — a glow, not a gradient.
 *
 * The amount comes from the blur band, so the darkness carries the same
 * wandering boundary as the softening and the two read as one effect.
 */
vec3 darkGlow(vec2 uv, vec2 pixel, float amount) {
  vec3 sum = vec3(0.0);

  for (int tap = 0; tap < 8; tap++) {
    // Turned off the glare's own bearings so the two ring patterns do not
    // reinforce each other into a single lumpy halo.
    float angle = float(tap) * (PI / 4.0) + 1.2;
    float radius = EDGE_GLOW_RADIUS * (tap % 2 == 0 ? 1.0 : 0.55);

    sum += scene(uv + vec2(cos(angle), sin(angle)) * radius * pixel);
  }

  return sum * (EDGE_GLOW_AMOUNT * amount / 8.0);
}

/** Cheap halo around the bright parts, the way a phosphor tube blooms. */
vec3 bloom(vec2 uv, vec2 pixel) {
  vec3 glow = vec3(0.0);

  for (int tap = 0; tap < 6; tap++) {
    float angle = float(tap) * (PI / 3.0);
    vec2 offset = vec2(cos(angle), sin(angle)) * BLOOM_RADIUS * pixel;

    glow += max(scene(uv + offset) - vec3(BLOOM_THRESHOLD), vec3(0.0));
  }

  return glow * (BLOOM_AMOUNT / 6.0);
}

/** Flattens the picture into painted bands and pushes it toward cel stock. */
vec3 cel(vec3 color) {
  float level = luma(color);
  float banded = floor(level * CEL_BANDS + 0.5) / CEL_BANDS;
  vec3 flattened = color * min(mix(1.0, banded / max(level, 0.0001), CEL_MIX), 3.0);

  return mix(vec3(luma(flattened)), flattened, CEL_SATURATION)
    * mix(SHADOW_TINT, HIGHLIGHT_TINT, clamp(luma(flattened) * 1.2, 0.0, 1.0));
}

/**
 * Scanlines on whole device-pixel rows. A fractional pitch would beat against
 * the scrolling scene and read as lines drifting up the screen, so the pitch
 * is rounded and the phase comes from the pixel row rather than from anything
 * that moves.
 */
float scanlines(float row) {
  float pitch = max(2.0, floor(uScale * SCANLINE_PITCH + 0.5));

  return 1.0 - SCANLINE_DEPTH * pow(sin(row * PI / pitch), 2.0);
}

/**
 * The cel the frame sits on: a coarse blotch across the whole picture and a
 * fine fibre in it. The fibre is centred on zero so it textures the surface
 * without lifting or dropping the grade.
 */
vec3 stock(vec3 color, vec2 uv, vec2 virtualPixel) {
  float blotch = mottle(uv * vec2(60.0, 40.0));
  float fibre = mottle(virtualPixel / PAPER_FIBRE_PITCH) - 0.5;

  return color * (1.0 - PAPER_GRAIN * blotch) * (1.0 + PAPER_FIBRE * fibre);
}

/**
 * Emulsion grain in two octaves: a speckle on every device pixel, and softer
 * clumps a few virtual pixels wide drifting through it. Both are centred on
 * zero, and both are fixed to the screen.
 */
float grain(vec2 virtualPixel) {
  return (hash(gl_FragCoord.xy) - 0.5) * TAPE_GRAIN
    + (mottle(virtualPixel / TAPE_CLUMP_PITCH) - 0.5) * TAPE_CLUMP;
}

/**
 * The print dot the cels were photographed through, turned 45 degrees and
 * snapped to whole device pixels so it cannot crawl. It works the mid-tones
 * only — the dot vanishes into flat black and flat white, as a real one does.
 */
vec3 screentone(vec3 color, vec2 virtualPixel) {
  // Wandered off the grid by a slow noise, so the lattice never resolves into
  // a machine pattern the eye can lock onto.
  vec2 drift = (vec2(
    mottle(virtualPixel / 40.0),
    mottle(virtualPixel / 40.0 + 17.3)) - 0.5) * SCREENTONE_DRIFT * uScale;
  vec2 cell = (gl_FragCoord.xy + drift)
    / max(2.0, floor(uScale * SCREENTONE_PITCH + 0.5));
  vec2 turned = vec2(cell.x + cell.y, cell.y - cell.x) * 0.70711;
  float dots = sin(turned.x * PI) * sin(turned.y * PI);
  float level = luma(color);

  return color
    * (1.0 + SCREENTONE_DEPTH * clamp(4.0 * level * (1.0 - level), 0.0, 1.0) * dots);
}

/** The aperture mask of the tube, one triad per three device pixels. */
vec3 shadowMask(float column) {
  vec3 mask = vec3(1.0 - MASK_DEPTH);

  mask[int(mod(column, 3.0))] = 1.0 + MASK_DEPTH;

  return mask;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 pixel = vec2(uScale) / uResolution;
  vec2 virtualPixel = uv / pixel;
  vec2 centred = abs(uv * 2.0 - 1.0);

  float wander = (mottle(virtualPixel / EDGE_BLUR_WANDER_PITCH) - 0.5)
    * EDGE_BLUR_WANDER;
  // The border band, which the darkening rides the whole way around, and the
  // lens softness, which is the same band with the corners taken back out.
  float band = edgeAmount(centred, wander);
  float softness = band * (1.0 - cornerClear(centred));
  float spread = EDGE_BLUR_RADIUS * softness;
  // The line out of the centre of the frame, which is the one the border is
  // nearest along. Guarded because it is undefined at the exact centre, where
  // there is no blur to stretch anyway.
  vec2 axis = (uv * 2.0 - 1.0) / max(length(uv * 2.0 - 1.0), 0.0001);

  vec2 jitterSeed = uv * vec2(24.0, 12.0);
  vec2 jitter = (vec2(valueNoise(jitterSeed), valueNoise(jitterSeed + 31.7)) - 0.5)
    * INK_JITTER;

  vec3 picture = tapeColor(uv, pixel);

  // Most of the picture is sharp, and the branch is coherent across it, so
  // the ring taps are only paid for around the border.
  if (softness > EDGE_BLUR_CUTOFF) {
    picture = mix(picture, gaussianBlur(uv, pixel, spread, axis), softness);
  }

  vec3 color = cel(picture) + bloom(uv, pixel) + glow(uv, pixel);
  float ink = smoothstep(
    INK_THRESHOLD,
    INK_THRESHOLD + INK_SOFTNESS,
    inkEdge(uv + jitter * pixel, pixel)) * INK_STRENGTH;

  // The line goes with the picture: where the lens is soft there is no ink.
  color = mix(color, INK_COLOR, ink * (1.0 - softness));
  color = screentone(stock(color, uv, virtualPixel), virtualPixel);
  color += grain(virtualPixel) * mix(1.5, 0.4, luma(color));

  color *= EXPOSURE;
  color *= scanlines(gl_FragCoord.y);
  color *= shadowMask(gl_FragCoord.x);
  color *= 1.0 - VIGNETTE * 0.5 * dot(uv * 2.0 - 1.0, uv * 2.0 - 1.0);
  color *= edgeShade(centred);
  color -= darkGlow(uv, pixel, band);

  fragColor = vec4(clamp(color, vec3(0.0), vec3(1.0)), 1.0);
}
`;
