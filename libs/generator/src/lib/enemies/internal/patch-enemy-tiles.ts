import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { EnemyPatch } from './types/enemy-patch';

export const patchEnemyTiles = ({ tiles, patches }: EnemyPatch): Tile[][] =>
  patchTiles(tiles, patches);
