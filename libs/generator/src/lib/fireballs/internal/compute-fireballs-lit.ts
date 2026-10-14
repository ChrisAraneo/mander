import type { Tile } from '@mander/model';
import { FIRST_FIREBALL_LEVEL, LAST_FIREBALL_LEVEL } from '../../consts';
import type { FireballLighting } from './types/fireball-lighting';

export const computeFireballsLit = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}): FireballLighting => ({
  tiles,
  lit:
    levelNumber >= FIRST_FIREBALL_LEVEL && levelNumber <= LAST_FIREBALL_LEVEL,
});
