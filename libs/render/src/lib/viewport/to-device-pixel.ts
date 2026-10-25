import { round } from 'lodash-es';

export const toDevicePixel = (world: number, scale: number): number =>
  round(world * scale) / scale;
