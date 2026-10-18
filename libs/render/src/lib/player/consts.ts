import type { PlayerColors } from './types/player-colors';

export const PLAYER_COLORS: Readonly<PlayerColors> = Object.freeze({
  legs: '#3F5A86',
  body: '#F4762C',
  strap: '#E0651F',
  skin: '#F2C49B',
  hair: '#4A3021',
  eye: '#1C1C28',
});

export const HURT_PLAYER_COLORS: Readonly<PlayerColors> = Object.freeze({
  legs: '#C81E1E',
  body: '#FF3B30',
  strap: '#D62222',
  skin: '#FF6B60',
  hair: '#8E1414',
  eye: '#4A0A0A',
});
