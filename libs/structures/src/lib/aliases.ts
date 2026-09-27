import { map } from 'lodash-es';

import {
  __,
  BT,
  CN,
  DR,
  EN,
  FB,
  SP,
  SC,
  SF,
  BR,
  ST,
  WD,
  CR,
  SS,
  EE,
} from './consts';

const ALIAS_MAP = new Map<number, string>([
  [__, '__'],
  [DR, 'DR'],
  [EN, 'EN'],
  [BT, 'BT'],
  [SP, 'SP'],
  [SC, 'SC'],
  [SF, 'SF'],
  [BR, 'BR'],
  [ST, 'ST'],
  [WD, 'WD'],
  [CR, 'CR'],
  [CN, 'CN'],
  [FB, 'FB'],
  [SS, 'SS'],
  [EE, 'EE'],
]);

const CELL_MAP = new Map<string, number>(
  map([...ALIAS_MAP], ([cell, alias]): [string, number] => [alias, cell]),
);

export const getAlias = (cell: number): string =>
  ALIAS_MAP.get(cell) ?? String(cell);

export const parseAlias = (alias: string): number =>
  CELL_MAP.get(alias) ?? Number(alias);
