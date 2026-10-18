import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { PlayerSpawnPatch } from './types/player-spawn-patch';

export const patchPlayerSpawnTiles = ({
  tiles,
  patches,
}: PlayerSpawnPatch): Tile[][] => patchTiles(tiles, patches);
