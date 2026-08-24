import { forEach } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_ENTITY_BOX } from '../chest/chest-entity-box';
import { GEM_ENTITY_BOX } from '../gem/gem-entity-box';
import { KEY_ENTITY_BOX } from '../key/key-entity-box';
import { PORTAL_ENTITY_BOX } from '../portal/portal-entity-box';
import { TILE_SIZE } from '../tile/consts';
import type { EntityBox } from './entity-box';
import { toEntityRectangle } from './to-entity-rectangle';

const BOX: EntityBox = {
  offsetX: 3,
  offsetY: -22,
  width: 26,
  height: 22,
};

describe('toEntityRectangle', () => {
  it('should hang the box off the bottom edge of its tile when the tile is the first one', () => {
    expect(toEntityRectangle({ x: 0, y: 0 }, BOX)).toEqual({
      x: 3,
      y: TILE_SIZE - 22,
      width: 26,
      height: 22,
    });
  });

  it('should place the box against the tile when the tile lies deep in the level', () => {
    expect(toEntityRectangle({ x: 4, y: 7 }, BOX)).toEqual({
      x: 4 * TILE_SIZE + 3,
      y: 8 * TILE_SIZE - 22,
      width: 26,
      height: 22,
    });
  });

  it('should carry the width and height straight through when given a box of its own', () => {
    const rectangle = toEntityRectangle({ x: 2, y: 2 }, PORTAL_ENTITY_BOX);

    expect(rectangle.width).toBe(PORTAL_ENTITY_BOX.width);
    expect(rectangle.height).toBe(PORTAL_ENTITY_BOX.height);
  });

  it('should shift by a whole tile when the tile steps one across', () => {
    expect(toEntityRectangle({ x: 1, y: 0 }, BOX).x).toBe(
      toEntityRectangle({ x: 0, y: 0 }, BOX).x + TILE_SIZE,
    );
  });

  it('should shift by a whole tile when the tile steps one down', () => {
    expect(toEntityRectangle({ x: 0, y: 1 }, BOX).y).toBe(
      toEntityRectangle({ x: 0, y: 0 }, BOX).y + TILE_SIZE,
    );
  });

  it('should stand the box flat on the floor of its tile when it belongs to the chest or the portal', () => {
    forEach([CHEST_ENTITY_BOX, PORTAL_ENTITY_BOX], (box) => {
      const rectangle = toEntityRectangle({ x: 5, y: 6 }, box);

      expect(rectangle.y + rectangle.height).toBe(7 * TILE_SIZE);
    });
  });

  it('should float the box clear of the floor of its tile when it belongs to the key or the gem', () => {
    forEach([KEY_ENTITY_BOX, GEM_ENTITY_BOX], (box) => {
      const rectangle = toEntityRectangle({ x: 5, y: 6 }, box);

      expect(rectangle.y + rectangle.height).toBeLessThan(7 * TILE_SIZE);
    });
  });
});
