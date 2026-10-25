import { describe, expect, it } from 'vitest';

import { CHEST_ENTITY_BOX } from '../chest/chest-entity-box';
import { GEM_ENTITY_BOX } from '../gem/gem-entity-box';
import { KEY_ENTITY_BOX } from '../key/key-entity-box';
import { PORTAL_ENTITY_BOX } from '../portal/portal-entity-box';
import { TILE_SIZE } from '../tile/consts';
import { getEntityRectangle } from './get-entity-rectangle';
import type { EntityBox } from './types/entity-box';

const BOX: EntityBox = {
  offsetX: 3,
  offsetY: -22,
  width: 26,
  height: 22,
};

const TILE_FLOOR = 7 * TILE_SIZE;

const computeBoxBottom = (box: EntityBox): number =>
  getEntityRectangle({ x: 5, y: 6 }, box).y + box.height;

describe('getEntityRectangle', () => {
  it('should place the box on the bottom edge of the tile when the tile is the first one', () => {
    expect(getEntityRectangle({ x: 0, y: 0 }, BOX)).toEqual({
      x: 3,
      y: TILE_SIZE - 22,
      width: 26,
      height: 22,
    });
  });

  it('should place the box on the tile when the tile is further into the level', () => {
    expect(getEntityRectangle({ x: 4, y: 7 }, BOX)).toEqual({
      x: 4 * TILE_SIZE + 3,
      y: 8 * TILE_SIZE - 22,
      width: 26,
      height: 22,
    });
  });

  it('should keep the width and height of the box when given a box', () => {
    const rectangle = getEntityRectangle({ x: 2, y: 2 }, PORTAL_ENTITY_BOX);

    expect(rectangle.width).toBe(PORTAL_ENTITY_BOX.width);
    expect(rectangle.height).toBe(PORTAL_ENTITY_BOX.height);
  });

  it('should move by one tile when the tile moves one to the right', () => {
    expect(getEntityRectangle({ x: 1, y: 0 }, BOX).x).toBe(
      getEntityRectangle({ x: 0, y: 0 }, BOX).x + TILE_SIZE,
    );
  });

  it('should move by one tile when the tile moves one down', () => {
    expect(getEntityRectangle({ x: 0, y: 1 }, BOX).y).toBe(
      getEntityRectangle({ x: 0, y: 0 }, BOX).y + TILE_SIZE,
    );
  });

  it('should put the bottom of the box on the floor of the tile when the box is the chest or the portal', () => {
    expect(computeBoxBottom(CHEST_ENTITY_BOX)).toBe(TILE_FLOOR);
    expect(computeBoxBottom(PORTAL_ENTITY_BOX)).toBe(TILE_FLOOR);
  });

  it('should put the bottom of the box above the floor of the tile when the box is the key or the gem', () => {
    expect(computeBoxBottom(KEY_ENTITY_BOX)).toBeLessThan(TILE_FLOOR);
    expect(computeBoxBottom(GEM_ENTITY_BOX)).toBeLessThan(TILE_FLOOR);
  });
});
