import { STROKE_COLOR } from '../stroke/consts';
import type { PlayerColors } from './types/player-colors';

export const PLAYER_COLORS: Readonly<PlayerColors> = Object.freeze({
  legs: '#3F5A86',
  body: '#F4762C',
  strap: '#E0651F',
  skin: '#F2C49B',
  hair: '#4A3021',
  eye: '#1C1C28',
  outline: STROKE_COLOR,
});

export const HURT_PLAYER_COLORS: Readonly<PlayerColors> = Object.freeze({
  legs: '#C81E1E',
  body: '#FF3B30',
  strap: '#D62222',
  skin: '#FF6B60',
  hair: '#8E1414',
  eye: '#4A0A0A',
  outline: STROKE_COLOR,
});

export const INVINCIBLE_OUTLINE_COLOR = '#FFFFFF';

export const INVINCIBLE_PLAYER_COLORS: Readonly<PlayerColors> = Object.freeze({
  ...PLAYER_COLORS,
  outline: INVINCIBLE_OUTLINE_COLOR,
});

export const INVINCIBLE_HURT_PLAYER_COLORS: Readonly<PlayerColors> =
  Object.freeze({
    ...HURT_PLAYER_COLORS,
    outline: INVINCIBLE_OUTLINE_COLOR,
  });

export const INVINCIBLE_MIN_ALPHA = 0.3;

export const INVINCIBLE_PULSES_PER_SECOND = 6;

export const COLD_PLAYER_COLORS: Readonly<PlayerColors> = Object.freeze({
  legs: '#2F5E86',
  body: '#7FC3E8',
  strap: '#5EA8D2',
  skin: '#BFE4F4',
  hair: '#3B5F74',
  eye: '#13303F',
  outline: STROKE_COLOR,
});
