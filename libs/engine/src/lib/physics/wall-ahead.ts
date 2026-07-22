import { floor } from 'lodash-es';
import { TILE_SIZE, isSolid, type Level } from '@mander/generator';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../state';

export function wallAhead(level: Level, originX: number, originY: number, facing: 1 | -1): boolean {
  const probeX = facing > 0 ? originX + ENEMY_WIDTH + 1 : originX - 1;
  const column = floor(probeX / TILE_SIZE);
  const topRow = floor((originY + 2) / TILE_SIZE);
  const bottomRow = floor((originY + ENEMY_HEIGHT - 2) / TILE_SIZE);
  for (let row = topRow; row <= bottomRow; row++) if (isSolid(level, column, row)) return true;
  return false;
}
