import type { Tile } from '@mander/model';
import { patchTiles } from '../patch-tiles';
import type { PlayerSpawnPatches } from './interfaces';

export const patchPlayerSpawnTiles = ({
  tiles,
  patches,
}: PlayerSpawnPatches): Tile[][] => patchTiles(tiles, patches);
