import { round } from 'lodash-es';

export const snapToDevicePixel = (world: number, scale: number): number =>
  round(world * scale) / scale;
