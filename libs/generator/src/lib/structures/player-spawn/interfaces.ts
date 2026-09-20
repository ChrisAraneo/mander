import type { Tile } from '@mander/model';
import type { TilePatch } from '../patch-tiles';

export interface PlayerSpawnCandidate {
  column: number;
  rows: number[];
}

export interface PlayerSpawnColumns {
  tiles: Tile[][];
  columns: number[];
}

export interface PlayerSpawnCandidates {
  tiles: Tile[][];
  candidates: PlayerSpawnCandidate[];
}

export interface FoundPlayerSpawn {
  tiles: Tile[][];
  found: PlayerSpawnCandidate | undefined;
}

export interface PlayerSpawnPatches {
  tiles: Tile[][];
  patches: TilePatch[];
}
