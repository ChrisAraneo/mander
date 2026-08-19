import { TILE_AIR, TILE_CANNON, TILE_DIRT, TILE_FIREBALL } from '@mander/model';
import { every } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getAlias, parseAlias } from './aliases';
import {
  __,
  BR,
  CN,
  CR,
  DR,
  EE,
  EN,
  FB,
  SC,
  SF,
  SP,
  SS,
  ST,
  WD,
} from './consts';

const CELLS = [__, DR, EN, SP, SC, SF, BR, ST, WD, CR, CN, FB, SS, EE];

describe('getAlias', () => {
  it('should name every cell the library writes', () => {
    expect(getAlias(TILE_AIR)).toBe('__');
    expect(getAlias(TILE_DIRT)).toBe('DR');
    expect(getAlias(TILE_CANNON)).toBe('CN');
    expect(getAlias(TILE_FIREBALL)).toBe('FB');
  });

  it('should fall back to the number when the cell has no alias', () => {
    expect(getAlias(97)).toBe('97');
  });
});

describe('parseAlias', () => {
  it('should read back every alias it writes', () => {
    expect(every(CELLS, (cell) => parseAlias(getAlias(cell)) === cell)).toBe(
      true,
    );
  });

  it('should read a bare number when the token has no alias', () => {
    expect(parseAlias('97')).toBe(97);
  });
});
