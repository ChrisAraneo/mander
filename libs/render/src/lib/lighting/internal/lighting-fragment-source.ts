import { TILE_SIZE } from '@mander/model';
import { MAX_LIGHT_OCCLUDERS, SUN_RAY_X, SUN_RAY_Y } from '../consts';

export const LIGHTING_FRAGMENT_SOURCE = `#version 300 es
precision highp float;

const float TILE_SIZE = ${TILE_SIZE.toFixed(1)};
const vec2 SUN_RAY = vec2(${SUN_RAY_X.toFixed(1)}, ${SUN_RAY_Y.toFixed(1)});
const float SUN_SPREAD = 44.0;
const float OCCLUDER_VISIBILITY = 0.3;
const float SHADOW_VISIBILITY = 0.75;
const int MAX_CROSSINGS = 72;
const float ABSORPTION = 0.06;
const float OPAQUE_PATH = 110.0;
const float SMALL = 0.00001;

const vec3 SHADOW_TINT = vec3(0.58, 0.6, 0.74);
const vec3 SUN_TINT = vec3(1.0, 0.82, 0.55);
const float AIR_SHADOW = 0.22;
const float SOLID_SHADOW = 1.0;
const float WARMTH_FAR = 0.03;
const float WARMTH_NEAR = 0.1;
const float WARMTH_REACH = 320.0;
const float GLOW = 0.07;
const float GLOW_REACH = 260.0;

uniform highp sampler2D uTiles;
uniform vec2 uLevelSize;
uniform vec2 uLightOrigin;
uniform vec2 uLightSize;
uniform vec2 uSun;
uniform vec4 uOccluders[${MAX_LIGHT_OCCLUDERS}];
uniform int uOccluderCount;

in vec2 vView;
out vec4 fragColor;

vec2 readTile(vec2 cell) {
  if (any(lessThan(cell, vec2(0.0))) || any(greaterThanEqual(cell, uLevelSize))) {
    return vec2(0.0);
  }

  return texelFetch(uTiles, ivec2(cell), 0).rg;
}

float traceTiles(vec2 from, vec2 to) {
  vec2 start = from / TILE_SIZE;
  vec2 span = (to - from) / TILE_SIZE;
  span = mix(span, vec2(SMALL), lessThan(abs(span), vec2(SMALL)));

  vec2 cell = floor(start);
  vec2 direction = sign(span);
  vec2 stride = abs(1.0 / span);
  vec2 crossing = (cell + max(direction, vec2(0.0)) - start) / span;
  float reach = length(to - from);
  float travelled = 0.0;
  float solid = 0.0;

  for (int index = 0; index < MAX_CROSSINGS && travelled < 1.0 && solid < OPAQUE_PATH; index++) {
    if ((direction.x < 0.0 && cell.x < 0.0) || (direction.y < 0.0 && cell.y < 0.0)) {
      break;
    }

    float leaving = min(min(crossing.x, crossing.y), 1.0);
    solid += readTile(cell).r * (leaving - travelled) * reach;
    travelled = leaving;

    if (crossing.x < crossing.y) {
      cell.x += direction.x;
      crossing.x += stride.x;
    } else {
      cell.y += direction.y;
      crossing.y += stride.y;
    }
  }

  return solid;
}

float traceOccluder(vec2 from, vec2 to, vec4 box) {
  vec2 span = to - from;
  span = mix(span, vec2(SMALL), lessThan(abs(span), vec2(SMALL)));

  vec2 firstEdge = (box.xy - from) / span;
  vec2 lastEdge = (box.xy + box.zw - from) / span;
  vec2 entering = min(firstEdge, lastEdge);
  vec2 leaving = max(firstEdge, lastEdge);
  float enter = max(entering.x, entering.y);
  float leave = min(min(leaving.x, leaving.y), 1.0);

  return enter > 0.0 ? max(leave - enter, 0.0) * length(to - from) : 0.0;
}

float traceOccluders(vec2 from, vec2 to) {
  float solid = 0.0;

  for (int index = 0; index < uOccluderCount; index++) {
    solid += traceOccluder(from, to, uOccluders[index]);
  }

  return solid;
}

float computeTransmission(float solid) {
  return exp(-ABSORPTION * solid);
}

void main() {
  vec2 inLight = vView * uLightSize;
  vec2 world = uLightOrigin + inLight;
  vec2 sun = world + SUN_RAY;
  vec2 side = vec2(-SUN_RAY.y, SUN_RAY.x) / length(SUN_RAY) * SUN_SPREAD;
  float sunDistance = length(uSun - inLight);

  float sunlight = (
    computeTransmission(traceTiles(world, sun)) +
    computeTransmission(traceTiles(world, sun + side)) +
    computeTransmission(traceTiles(world, sun - side))
  ) / 3.0;

  float lit = sunlight * mix(1.0, computeTransmission(traceOccluders(world, sun)), OCCLUDER_VISIBILITY);

  float visibleLit = 1.0 - (1.0 - lit) * SHADOW_VISIBILITY;

  float shadowDepth = mix(AIR_SHADOW, SOLID_SHADOW, readTile(floor(world / TILE_SIZE)).g);

  vec3 shaded = mix(vec3(1.0), SHADOW_TINT, shadowDepth);
  float warmth = WARMTH_FAR + WARMTH_NEAR * exp(-sunDistance / WARMTH_REACH);
  vec3 sunlit = vec3(1.0) + SUN_TINT * warmth;
  float glow = GLOW * exp(-sunDistance / GLOW_REACH);

  vec3 exposure = mix(shaded, sunlit, visibleLit) + SUN_TINT * glow * visibleLit;
  float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));

  fragColor = vec4(exposure * 0.5 + (grain - 0.5) / 255.0, 1.0);
}
`;
