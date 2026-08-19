import { round } from 'lodash-es';

export interface DeviceSize {
  width: number;
  height: number;
}

export const deviceSize = (canvas: HTMLCanvasElement): DeviceSize => ({
  width: round(
    Math.max(1, canvas.clientWidth) * (window.devicePixelRatio || 1),
  ),
  height: round(
    Math.max(1, canvas.clientHeight) * (window.devicePixelRatio || 1),
  ),
});
