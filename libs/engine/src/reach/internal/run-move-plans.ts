import type { Player } from '@mander/model';
import { flatMap } from 'lodash-es';
import { MOVE_PLANS } from './move-plans';
import { runMovePlan } from './run-move-plan';
import type { Walk } from './types/walk';

export const runMovePlans = (walk: Walk, frontier: Player[]): Player[] =>
  flatMap(frontier, (player) =>
    flatMap(MOVE_PLANS, (plan) => runMovePlan(walk.level, plan, player)),
  );
