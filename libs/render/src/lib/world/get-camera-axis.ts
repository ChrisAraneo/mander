import { match } from 'ts-pattern';
import { snapToDevicePixel } from '../viewport/snap-to-device-pixel';
import { computeCenteredCameraAxis } from './internal/compute-centered-camera-axis';
import { computeFollowingCameraAxis } from './internal/compute-following-camera-axis';

export const getCameraAxis = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
  scale: number,
): number =>
  snapToDevicePixel(
    match(worldSize < viewSize)
      .with(true, () => computeCenteredCameraAxis(viewSize, worldSize))
      .otherwise(() =>
        computeFollowingCameraAxis(focusAt, viewSize, worldSize),
      ),
    scale,
  );
