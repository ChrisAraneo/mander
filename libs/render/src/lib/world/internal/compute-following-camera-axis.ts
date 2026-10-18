import { clamp } from 'lodash-es';

export const computeFollowingCameraAxis = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
): number => clamp(focusAt - viewSize / 2, 0, worldSize - viewSize);
