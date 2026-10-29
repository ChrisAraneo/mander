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

const FAST_PALETTE: EnemyPalette = {
  feet: '#A8861E',
  body: '#E0BC2C',
  belly: '#FFE06F',
  brow: '#4A3A0C',
};

const SHOOTER_PALETTE: EnemyPalette = {
  feet: '#4A4A4A',
  body: '#8A8A8A',
  belly: '#B8B8B8',
  brow: '#232323',
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
    .with('FAST', () => FAST_PALETTE)
    .with('SHOOTER', () => SHOOTER_PALETTE)
    .with('FLYING', () => FLYING_PALETTE)
    .with('BEARTRAP', () => HOPPING_PALETTE)
    .exhaustive();
