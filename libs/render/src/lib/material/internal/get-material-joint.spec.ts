import { TILE_BRICK, TILE_DIRT, TILE_WOOD } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { JOINT, WOOD_JOINT } from '../consts';
import { getMaterialJoint } from './get-material-joint';

describe('getMaterialJoint', () => {
  it('should give the dark wood joint when the tile is wood', () => {
    const result = getMaterialJoint(TILE_WOOD);

    expect(result).toBe(WOOD_JOINT);
  });

  it('should give the usual joint when the tile is brick', () => {
    const result = getMaterialJoint(TILE_BRICK);

    expect(result).toBe(JOINT);
  });

  it('should give the usual joint when the tile is dirt', () => {
    const result = getMaterialJoint(TILE_DIRT);

    expect(result).toBe(JOINT);
  });
});
