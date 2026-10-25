import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { Layers } from '@mander/model';
import { head, size } from 'lodash-es';
import { toStructureTiles } from './internal/to-structure-tiles';

export const createStructureTileMap = ({
  tiles,
  backTiles,
}: Layers): GameLevel => ({
  seed: '',
  width: size(head(tiles)),
  height: size(tiles),
  tiles: toStructureTiles(tiles),
  backTiles: toStructureTiles(backTiles),
  chestItems: [],
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});
