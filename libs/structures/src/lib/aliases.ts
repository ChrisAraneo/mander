import { __, CN, DR, EN, FB, SP, SC, BR, ST, WD, CR, SS, EE } from './consts';

const ALIAS_MAP = new Map<number, string>([
  [__, '__'],
  [DR, 'DR'],
  [EN, 'EN'],
  [SP, 'SP'],
  [SC, 'SC'],
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
  [...ALIAS_MAP].map(([cell, alias]) => [alias, cell]),
);

export const getAlias = (cell: number): string =>
  ALIAS_MAP.get(cell) ?? String(cell);

export const parseAlias = (alias: string): number =>
  CELL_MAP.get(alias) ?? Number(alias);
