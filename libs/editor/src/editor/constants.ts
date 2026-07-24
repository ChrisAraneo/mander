import { AIR, BLOCK, ENEMY } from '@mander/generator';

export const CELL = 30;

export const COLORS = {
  block: '#5B4634',
  cap: '#6FAF58',
  pit: 'RGBA(224, 102, 102, 0.12)',
  line: 'RGBA(255, 255, 255, 0.06)',
  ground: '#D8B26A',
  reachable: '#6FAF58',
  stranded: '#E0651F',
  cramped: 'RGBA(224, 101, 31, 0.25)',
  enemy: '#B5473F',
  player: 'RGBA(244, 118, 44, 0.32)',
  playerOutline: '#F4762C',
};

export const TOOLS = [
  { value: BLOCK, label: 'Block' },
  { value: ENEMY, label: 'Enemy' },
  { value: AIR, label: 'Erase' },
] as const;
