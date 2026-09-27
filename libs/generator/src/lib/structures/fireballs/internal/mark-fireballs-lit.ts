import type { Tile } from '@mander/model';
import { FIRST_FIREBALL_LEVEL, LAST_FIREBALL_LEVEL } from '../../../consts';

export const markFireballsLit = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}) => ({
  tiles,
  lit:
    levelNumber >= FIRST_FIREBALL_LEVEL && levelNumber <= LAST_FIREBALL_LEVEL,
});
