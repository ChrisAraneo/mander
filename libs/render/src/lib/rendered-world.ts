import type { World } from '@mander/engine';

import type { Palette } from './palette';

export interface RenderedWorld extends World {
  palette: Palette;
}
