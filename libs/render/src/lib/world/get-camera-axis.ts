import { clamp } from 'lodash-es';
import { match } from 'ts-pattern';

import { snapToDevicePixel } from '../viewport';

const centreView = (viewSize: number, worldSize: number): number =>
  (worldSize - viewSize) / 2;

const followFocus = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
): number => clamp(focusAt - viewSize / 2, 0, worldSize - viewSize);

export const getCameraAxis = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
  scale: number,
): number =>
  snapToDevicePixel(
    match(worldSize < viewSize)
      .with(true, () => centreView(viewSize, worldSize))
      .otherwise(() => followFocus(focusAt, viewSize, worldSize)),
    scale,
  );
