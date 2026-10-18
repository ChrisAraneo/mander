import { type Tile, TILE_WOOD } from '@mander/model';
import { match } from 'ts-pattern';
import { WOOD_JOINT, JOINT } from '../consts';

export const getMaterialJoint = (tile: Tile): string =>
  match(tile)
    .with(TILE_WOOD, () => WOOD_JOINT)
    .otherwise(() => JOINT);
