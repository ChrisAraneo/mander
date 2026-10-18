import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';
import type { EnemyPalette } from './types/enemy-palette';

const HOPPING_PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

const HORNED_PALETTE: EnemyPalette = {
  feet: '#7D2F2A',
  body: '#B5473F',
  belly: '#D5695F',
  brow: '#3A1512',
};

const FLYING_PALETTE: EnemyPalette = {
  feet: '#1E5FA8',
  body: '#3C8DE0',
  belly: '#7FC3FF',
  brow: '#123A6B',
};

export const getEnemyPalette = (kind: EnemyKind): EnemyPalette =>
  match(kind)
    .with('HOPPING', () => HOPPING_PALETTE)
    .with('HORNED', () => HORNED_PALETTE)
    .with('FLYING', () => FLYING_PALETTE)
    .with('BEARTRAP', () => HOPPING_PALETTE)
    .exhaustive();
