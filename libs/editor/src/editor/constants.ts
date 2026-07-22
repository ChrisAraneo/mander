import { AIR, BLOCK, ENEMY } from '@mander/generator';

export const CELL = 30;

export const COLORS = {
  block: '#5b4634',
  cap: '#6faf58',
  pit: 'rgba(224, 102, 102, 0.12)',
  line: 'rgba(255, 255, 255, 0.06)',
  ground: '#d8b26a',
  reachable: '#6faf58',
  stranded: '#e0651f',
  enemy: '#b5473f',
};

export const TOOLS = [
  { value: BLOCK, label: 'Block' },
  { value: ENEMY, label: 'Enemy' },
  { value: AIR, label: 'Erase' },
] as const;
