import { type Level, type Player } from '@mander/model';
import { runFlight } from './run-flight';
import type { MovePlan } from './types/move-plan';

export const runMovePlan = (
  level: Level,
  plan: MovePlan,
  player: Player,
): Player[] => runFlight({ level, plan }, player, 0, []);
