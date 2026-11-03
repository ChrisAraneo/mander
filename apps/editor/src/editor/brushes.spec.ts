import { TILE_CANNON, TILE_CANNON_TRIPLE, TILE_SAND } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BRUSHES } from './brushes';

describe('BRUSHES', () => {
  it('should offer the regular cannon when the picker lists the brushes', () => {
    expect(map(BRUSHES, (brush) => brush.value)).toContain(TILE_CANNON);
  });

  it('should offer no triple cannon when the picker lists the brushes', () => {
    expect(map(BRUSHES, (brush) => brush.value)).not.toContain(
      TILE_CANNON_TRIPLE,
    );
  });

  it('should offer no sand when the picker lists the brushes', () => {
    expect(map(BRUSHES, (brush) => brush.value)).not.toContain(TILE_SAND);
  });
});
