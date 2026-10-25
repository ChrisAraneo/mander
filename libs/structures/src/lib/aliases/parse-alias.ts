import { map } from 'lodash-es';
import { ALIAS_MAP } from './consts';

const CELL_MAP: ReadonlyMap<string, number> = new Map<string, number>(
  map([...ALIAS_MAP], ([cell, alias]): [string, number] => [alias, cell]),
);

export const parseAlias = (alias: string): number =>
  CELL_MAP.get(alias) ?? Number(alias);
