import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { parseCells } from './parse-cells';

describe('parseCells', () => {
  it('should read every alias of the row into its tile when the row has cells', () => {
    expect(parseCells('__, BR, __')).toEqual([TILE_AIR, TILE_BRICK, TILE_AIR]);
  });

  it('should give no cells when the row is empty', () => {
    expect(parseCells(' ')).toEqual([]);
  });
});
