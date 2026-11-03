import { type Tile, TILE_ICE, TILE_SAND, TILE_WOOD } from '@mander/model';
import { match } from 'ts-pattern';
import { WOOD_JOINT, ICE_JOINT, JOINT, SAND_JOINT } from '../consts';

export const getMaterialJoint = (tile: Tile): string =>
  match(tile)
    .with(TILE_WOOD, () => WOOD_JOINT)
    .with(TILE_ICE, () => ICE_JOINT)
    .with(TILE_SAND, () => SAND_JOINT)
    .otherwise(() => JOINT);
