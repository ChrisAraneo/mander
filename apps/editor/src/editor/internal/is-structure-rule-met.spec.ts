import { type Layers, TILE_SPIKE } from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import { assign, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createSketch } from '../create-sketch';
import { isStructureRuleMet } from './is-structure-rule-met';

const UNKNOWN_TILE = 77;

const STANDING_ROW = STRUCTURE_HEIGHT - 2;

const createMarkedSketch = (): Layers =>
  tap(createSketch('normal'), (sketch) =>
    assign(sketch.tiles[STANDING_ROW], {
      0: STRUCTURE_START,
      [STRUCTURE_WIDTH - 1]: STRUCTURE_END,
    }),
  );

describe('isStructureRuleMet', () => {
  it('should check the size against the pool when the rule is the size', () => {
    expect(isStructureRuleMet(createSketch('normal'), 'normal', 'SIZE')).toBe(
      true,
    );
    expect(isStructureRuleMet(createSketch('normal'), 'vertical', 'SIZE')).toBe(
      false,
    );
  });

  it('should turn away an unknown tile when the rule is the known tiles', () => {
    const sketch = createMarkedSketch();

    sketch.tiles[0][3] = UNKNOWN_TILE;

    expect(isStructureRuleMet(sketch, 'normal', 'KNOWN_TILES')).toBe(false);
  });

  it('should turn away a hazard behind the level when the rule is the back layer', () => {
    const sketch = createMarkedSketch();

    sketch.backTiles[0][3] = TILE_SPIKE;

    expect(isStructureRuleMet(sketch, 'normal', 'BACK_LAYER')).toBe(false);
  });

  it('should ask for exactly one start when the rule is the start', () => {
    expect(
      isStructureRuleMet(createMarkedSketch(), 'normal', 'ONE_START'),
    ).toBe(true);
    expect(
      isStructureRuleMet(createSketch('normal'), 'normal', 'ONE_START'),
    ).toBe(false);
  });

  it('should ask for exactly one end when the rule is the end', () => {
    expect(isStructureRuleMet(createMarkedSketch(), 'normal', 'ONE_END')).toBe(
      true,
    );
    expect(
      isStructureRuleMet(createSketch('normal'), 'normal', 'ONE_END'),
    ).toBe(false);
  });

  it('should turn away a floating spike when the rule is the anchored hazards', () => {
    const sketch = createMarkedSketch();

    sketch.tiles[2][5] = TILE_SPIKE;

    expect(isStructureRuleMet(sketch, 'normal', 'ANCHORED_HAZARDS')).toBe(
      false,
    );
  });

  it('should find every rule met but the size and the markers when the sketch is empty', () => {
    const sketch = { tiles: [], backTiles: [] };

    expect(isStructureRuleMet(sketch, 'normal', 'SIZE')).toBe(false);
    expect(isStructureRuleMet(sketch, 'normal', 'KNOWN_TILES')).toBe(true);
    expect(isStructureRuleMet(sketch, 'normal', 'BACK_LAYER')).toBe(true);
    expect(isStructureRuleMet(sketch, 'normal', 'ONE_START')).toBe(false);
    expect(isStructureRuleMet(sketch, 'normal', 'ONE_END')).toBe(false);
    expect(isStructureRuleMet(sketch, 'normal', 'ANCHORED_HAZARDS')).toBe(true);
  });
});
