import { __, DR, EN, SP, SC, BR, ST, WD, CR, SS, EE } from './consts';

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
  [SS, 'SS'],
  [EE, 'EE'],
]);

export const getAlias = (cell: number): string =>
  ALIAS_MAP.get(cell) ?? String(cell);
