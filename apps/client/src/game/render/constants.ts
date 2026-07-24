import type { HillLayer } from './hill-layer';

export const VIEW_WIDTH = 960;
export const VIEW_HEIGHT = 480;

export const HILL_LAYERS: readonly HillLayer[] = [
  { parallax: 0.2, amplitude: 46, baselineRatio: 0.6 },
  { parallax: 0.45, amplitude: 58, baselineRatio: 0.775 },
];
