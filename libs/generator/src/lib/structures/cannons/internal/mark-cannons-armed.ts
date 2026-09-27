import type { Tile } from '@mander/model';
import { FIRST_CANNON_LEVEL } from '../../../consts';

export const markCannonsArmed = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}) => ({
  tiles,
  armed: levelNumber >= FIRST_CANNON_LEVEL,
});
