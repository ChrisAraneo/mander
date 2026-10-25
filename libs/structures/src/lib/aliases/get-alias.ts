import { ALIAS_MAP } from './consts';

export const getAlias = (cell: number): string =>
  ALIAS_MAP.get(cell) ?? String(cell);
