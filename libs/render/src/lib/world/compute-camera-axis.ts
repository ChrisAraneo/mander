import { match } from 'ts-pattern';
import { toDevicePixel } from '../viewport/to-device-pixel';
import { computeCenteredCameraAxis } from './internal/compute-centered-camera-axis';
import { computeFollowingCameraAxis } from './internal/compute-following-camera-axis';

export const computeCameraAxis = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
  scale: number,
): number =>
  toDevicePixel(
    match(worldSize < viewSize)
      .with(true, () => computeCenteredCameraAxis(viewSize, worldSize))
      .otherwise(() =>
        computeFollowingCameraAxis(focusAt, viewSize, worldSize),
      ),
    scale,
  );
