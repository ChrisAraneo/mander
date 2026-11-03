import { LIGHT_OCCLUDER_MARGIN } from '../consts';
import type { LightOccluder } from '../types/light-occluder';
import type { LightingScene } from '../types/lighting-scene';

export const isLightOccluderInView = (
  occluder: LightOccluder,
  { viewport, cameraX, cameraY }: LightingScene,
): boolean =>
  occluder.x + occluder.width > cameraX - LIGHT_OCCLUDER_MARGIN &&
  occluder.x < cameraX + viewport.width + LIGHT_OCCLUDER_MARGIN &&
  occluder.y + occluder.height > cameraY - LIGHT_OCCLUDER_MARGIN &&
  occluder.y < cameraY + viewport.height + LIGHT_OCCLUDER_MARGIN;
