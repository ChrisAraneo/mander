import type { GameWorld } from '@mander/engine';

import type { Palette } from '../palette';

export interface RenderedWorld extends GameWorld {
  palette: Palette;
}
