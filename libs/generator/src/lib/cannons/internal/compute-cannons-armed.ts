import type { Tile } from '@mander/model';
import { FIRST_CANNON_LEVEL } from '../../consts';
import type { CannonArming } from './types/cannon-arming';

export const computeCannonsArmed = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}): CannonArming => ({
  tiles,
  armed: levelNumber >= FIRST_CANNON_LEVEL,
});
