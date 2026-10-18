import { CANNONBALL_SIZE } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import type { SphereColors } from '../../sphere/types/sphere-colors';

export const HALF_TILE = TILE_SIZE / 2;

export const BARREL_BACK = -5;

export const BARREL_LENGTH = HALF_TILE + 7;

export const IRON = '#454E62';

export const IRON_LIGHT = '#6B7690';

export const IRON_DARK = '#1D2330';

export const CANNONBALL_RADIUS = CANNONBALL_SIZE / 2;

export const CANNONBALL_IRON: Readonly<SphereColors> = Object.freeze({
  light: '#7C8496',
  deep: '#171C26',
  shine: 'RGBA(255, 255, 255, 0.55)',
});
