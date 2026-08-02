import type { Hsl } from '@mander/utils';
import { match } from 'ts-pattern';

import { TILE_BRICK } from '../blocks/brick';
import { TILE_CERAMIC } from '../blocks/ceramic';
import { TILE_STONE } from '../blocks/stone';
import { TILE_WOOD } from '../blocks/wood';
import type { Tile } from '../tile/tile';

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
/**
 * Ceramic is the one glazed material, and the only one that gets a hue of its
 * own rather than a shade of the ground's. It used to sit a few degrees off
 * stone and 46 points brighter, which made it read as white no matter what the
 * level rolled — two greys, one of them washed out. Turning it most of the way
 * round the wheel puts it clear of the ground, of stone, and of the band the
 * grass cap is rolled in, so it stays a colour instead of a highlight.
 */
const CERAMIC_TINT: MaterialTint = { hue: 265, saturation: 22, lightness: 22 };

/** How much lighter the exposed top of a block is than its body. */
export const CAP_LIGHTNESS_GAIN = 7;

export const materialTint = (tile: Tile): MaterialTint =>
  match(tile)
    .with(TILE_BRICK, () => BRICK_TINT)
    .with(TILE_STONE, () => STONE_TINT)
    .with(TILE_WOOD, () => WOOD_TINT)
    .with(TILE_CERAMIC, () => CERAMIC_TINT)
    .otherwise(() => DIRT_TINT);
