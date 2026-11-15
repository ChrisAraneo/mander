import { createRandom } from '@mander/common';
import type { Fireball, Level } from '@mander/model';
import { createLevelFireballs } from './internal/create-level-fireballs';

export const createFireballs = (level: Level): Fireball[] =>
  createLevelFireballs(level, createRandom(`${level.seed}#fireballs`));
