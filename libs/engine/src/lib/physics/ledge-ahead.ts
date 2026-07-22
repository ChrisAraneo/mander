import { floor } from 'lodash-es';
import { TILE_SIZE, isSolid, type Level } from '@mander/generator';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../state';

export function ledgeAhead(level: Level, originX: number, originY: number, facing: 1 | -1): boolean {
  const probeX = facing > 0 ? originX + ENEMY_WIDTH + 1 : originX - 1;
  const column = floor(probeX / TILE_SIZE);
  const belowRow = floor((originY + ENEMY_HEIGHT + 2) / TILE_SIZE);
  return !isSolid(level, column, belowRow);
}
