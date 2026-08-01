import type { Hsl } from '@mander/utils';
import { match } from 'ts-pattern';

import type { Tile } from '../tile/tile';
import { TILE_BRICK } from './brick';
import { TILE_CERAMIC } from './ceramic';
import { TILE_STONE } from './stone';
import { TILE_WOOD } from './wood';

/**
 * Where a material sits relative to the ground colour the level rolled. Dirt is
 * the ground itself; the rest are steps away from it, so a level's blocks are
 * always a family rather than five unrelated colours. The numbers are the gaps
 * the hand-picked styles used to have, so a brown ground still gives red brick
 * and grey stone.
 */
export type MaterialTint = Partial<Hsl>;

const DIRT_TINT: MaterialTint = {};
const BRICK_TINT: MaterialTint = { hue: -20, saturation: 12, lightness: 16 };
const STONE_TINT: MaterialTint = { hue: 183, saturation: -22, lightness: 19 };
const WOOD_TINT: MaterialTint = { hue: -4, lightness: 18 };
const CERAMIC_TINT: MaterialTint = { hue: 177, saturation: -12, lightness: 46 };

/** How much lighter the exposed top of a block is than its body. */
export const CAP_LIGHTNESS_GAIN = 7;

export const materialTint = (tile: Tile): MaterialTint =>
  match(tile)
    .with(TILE_BRICK, () => BRICK_TINT)
    .with(TILE_STONE, () => STONE_TINT)
    .with(TILE_WOOD, () => WOOD_TINT)
    .with(TILE_CERAMIC, () => CERAMIC_TINT)
    .otherwise(() => DIRT_TINT);
