import { type Layers, TILE_SPIKE, TILE_SPIKE_CEILING } from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  findVerticalIssues,
} from '@mander/structures';
import { assign, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createSketch } from './create-sketch';
import { findStructureIssues } from './find-structure-issues';

const UNKNOWN_TILE = 77;

const STANDING_ROW = STRUCTURE_HEIGHT - 2;

const createMarkedSketch = (): Layers =>
  tap(createSketch('normal'), (sketch) =>
    assign(sketch.tiles[STANDING_ROW], {
      0: STRUCTURE_START,
      [STRUCTURE_WIDTH - 1]: STRUCTURE_END,
    }),
  );

describe('findStructureIssues', () => {
  it('should find nothing when the sector is sound', () => {
    expect(findStructureIssues(createMarkedSketch(), 'normal')).toEqual([]);
  });

  it('should ask for a start and an end when the sector marks neither', () => {
    expect(findStructureIssues(createSketch('normal'), 'normal')).toEqual([
      'mark where the player enters with exactly one start (98)',
      'mark where the player leaves with exactly one end (99)',
    ]);
  });

  it('should name the size first when the sector is cut to the wrong size', () => {
    const sketch = createMarkedSketch();

    sketch.backTiles.pop();

    expect(findStructureIssues(sketch, 'normal')).toEqual([
      `both layers must be ${STRUCTURE_WIDTH} × ${STRUCTURE_HEIGHT} cells`,
    ]);
  });

  it('should turn away a tile the game does not know when the level holds one', () => {
    const sketch = createMarkedSketch();

    sketch.tiles[0][3] = UNKNOWN_TILE;

    expect(findStructureIssues(sketch, 'normal')).toEqual([
      'every cell must be a tile the game knows, a start (98) or an end (99)',
    ]);
  });

  it('should turn away a hazard when it is painted on the back layer', () => {
    const sketch = createMarkedSketch();

    sketch.backTiles[0][3] = TILE_SPIKE;

    expect(findStructureIssues(sketch, 'normal')).toEqual([
      'the back layer takes blocks alone — a hazard or a marker has nothing to do behind the level',
    ]);
  });

  it('should ask for an anchor when a spike floats or a ceiling spike hangs from nothing', () => {
    const floating = createMarkedSketch();
    const hanging = createMarkedSketch();

    floating.tiles[2][5] = TILE_SPIKE;
    hanging.tiles[STANDING_ROW][5] = TILE_SPIKE_CEILING;

    const message =
      'a spike or beartrap needs a block below it, a ceiling or falling spike one above — a background block is not something to stand on';

    expect(findStructureIssues(floating, 'normal')).toEqual([message]);
    expect(findStructureIssues(hanging, 'normal')).toEqual([message]);
  });

  it('should add the vertical checks when the pool is the vertical one', () => {
    const sketch = createSketch('vertical');

    expect(findStructureIssues(sketch, 'vertical')).toEqual(
      findVerticalIssues(sketch.tiles),
    );
  });
});
