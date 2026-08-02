import type { World } from '@mander/engine';

import type { Palette } from './palette';

/**
 * A world with the colours it is painted in. The palette is rolled once for the
 * whole world rather than per level, so every level of a day agrees on its sky,
 * its hills and the ground the player runs over.
 */
export interface RenderedWorld extends World {
  palette: Palette;
}
