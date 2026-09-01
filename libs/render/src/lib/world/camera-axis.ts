import { clamp } from 'lodash-es';
import { match } from 'ts-pattern';

import { snapToDevicePixel } from '../viewport';

const centred = (viewSize: number, worldSize: number): number =>
  (worldSize - viewSize) / 2;

const followed = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
): number => clamp(focusAt - viewSize / 2, 0, worldSize - viewSize);

export const cameraAxis = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
  scale: number,
): number =>
  snapToDevicePixel(
    match(worldSize < viewSize)
      .with(true, () => centred(viewSize, worldSize))
      .otherwise(() => followed(focusAt, viewSize, worldSize)),
    scale,
  );
