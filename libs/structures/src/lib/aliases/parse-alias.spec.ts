import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  __,
  BR,
  BT,
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
} from '../consts';
import { getAlias } from './get-alias';
import { parseAlias } from './parse-alias';

const CELLS = [__, DR, EN, BT, SP, SC, SF, BR, ST, WD, CR, CN, FB, SS, EE];

describe('parseAlias', () => {
  it('should return the cell when it is given the alias of that cell', () => {
    expect(map(CELLS, (cell) => parseAlias(getAlias(cell)))).toEqual(CELLS);
  });

  it('should return the number when the text is not an alias', () => {
    expect(parseAlias('97')).toBe(97);
  });
});
