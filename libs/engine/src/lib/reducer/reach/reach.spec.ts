import { every, map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { checkPlayerReach } from './check-player-reach';
import { isReachableCell } from './is-reachable-cell';
import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';

const WIDTH = 20;
const HEIGHT = 8;

const AIR_ROW: Tile[] = map(range(WIDTH), (): Tile => TILE_AIR);
const GROUND_ROW: Tile[] = map(range(WIDTH), (): Tile => TILE_DIRT);

const tileMap = (rows: Record<number, Tile[]>): Level => ({
  seed: 'TEST',
  width: WIDTH,
  height: HEIGHT,
  tiles: map(range(HEIGHT), (row) => rows[row] ?? AIR_ROW),
  chestItems: [],
});

const pitRow = (from: number, to: number): Tile[] =>
  map(GROUND_ROW, (tile, column) =>
    column >= from && column <= to ? TILE_AIR : tile,
  );

const platformRow = (columns: number[]): Tile[] =>
  map(AIR_ROW, (tile, column) => (columns.includes(column) ? TILE_DIRT : tile));

const FLAT = tileMap({ 7: GROUND_ROW });

const PERCH = tileMap({ 4: platformRow([8, 9, 10]), 7: GROUND_ROW });

const TOWER = tileMap({ 1: platformRow([8, 9, 10]), 7: GROUND_ROW });

const LEDGE_5 = tileMap({ 2: platformRow(range(10, 20)), 7: GROUND_ROW });

const LEDGE_4 = tileMap({ 3: platformRow(range(10, 20)), 7: GROUND_ROW });

const PIT_5 = tileMap({ 7: pitRow(5, 9) });

const PIT_6 = tileMap({ 7: pitRow(5, 10) });

const SPIKE_RUN = tileMap({
  6: map(AIR_ROW, (tile, column): Tile => (column === 8 ? TILE_SPIKE : tile)),
  7: GROUND_ROW,
});

const FLOATING = tileMap({ 4: platformRow([8, 9, 10]) });

describe('checkPlayerReach', () => {
  it('marks the whole floor of a flat tile map as reachable', () => {
    const reach = checkPlayerReach(FLAT);

    expect(
      every(range(WIDTH), (column) => isReachableCell(reach, 7, column)),
    ).toBe(true);
  });

  it('shapes the map like the tiles it was given', () => {
    const reach = checkPlayerReach(FLAT);

    expect(reach.length).toBe(HEIGHT);
    expect(every(reach, (cells) => cells.length === WIDTH)).toBe(true);
  });

  it('reaches a perch three cells above the floor', () => {
    expect(isReachableCell(checkPlayerReach(PERCH), 4, 9)).toBe(true);
  });

  it('leaves a platform six cells above the floor stranded', () => {
    const reach = checkPlayerReach(TOWER);

    expect(isReachableCell(reach, 1, 9)).toBe(false);
    expect(isReachableCell(reach, 7, 9)).toBe(true);
  });

  it('climbs a ledge four cells up but not five', () => {
    expect(isReachableCell(checkPlayerReach(LEDGE_4), 3, 15)).toBe(true);
    expect(isReachableCell(checkPlayerReach(LEDGE_5), 2, 15)).toBe(false);
  });

  it('jumps a five column pit but not a six column one', () => {
    expect(isReachableCell(checkPlayerReach(PIT_5), 7, 15)).toBe(true);
    expect(isReachableCell(checkPlayerReach(PIT_6), 7, 15)).toBe(false);
  });

  it('treats spikes as passable rather than as walls', () => {
    expect(isReachableCell(checkPlayerReach(SPIKE_RUN), 7, 15)).toBe(true);
  });

  it('reaches nothing when the entry column has no floor', () => {
    const reach = checkPlayerReach(FLOATING);

    expect(
      every(reach, (cells) => every(cells, (cell) => cell === false)),
    ).toBe(true);
  });

  it('never reports a cell outside the tile map as reachable', () => {
    const reach = checkPlayerReach(FLAT);

    expect(isReachableCell(reach, -1, 0)).toBe(false);
    expect(isReachableCell(reach, 0, -1)).toBe(false);
    expect(isReachableCell(reach, HEIGHT, 0)).toBe(false);
    expect(isReachableCell(reach, 0, WIDTH)).toBe(false);
  });
});
