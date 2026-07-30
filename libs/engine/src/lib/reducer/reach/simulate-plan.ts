import { type Level, type Player, TILE_SIZE } from '@mander/model';
import { match } from 'ts-pattern';

import { stepPlayer } from '../player/step-player';
import { FRAME_SECONDS, MAX_GROUNDED_FRAMES, MAX_PLAN_FRAMES } from './consts';
import { planInput } from './plan-input';
import type { MovePlan } from './move-plan';

interface Flight {
  tiles: Level;
  plan: MovePlan;
}

const hasFallenOut = (tiles: Level, player: Player): boolean =>
  player.position.y > tiles.height * TILE_SIZE;

const hasSettled = (previous: Player, next: Player, frame: number): boolean =>
  (next.statuses.isGrounded && previous.statuses.isGrounded === false) ||
  (next.statuses.isGrounded && frame + 1 >= MAX_GROUNDED_FRAMES) ||
  frame + 1 >= MAX_PLAN_FRAMES;

const advance = (
  flight: Flight,
  player: Player,
  frame: number,
  states: Player[],
): Player[] => {
  const next = stepPlayer(
    flight.tiles,
    player,
    planInput(flight.plan, frame),
    FRAME_SECONDS,
  );

  return match({
    hasFallenOut: hasFallenOut(flight.tiles, next),
    hasSettled: hasSettled(player, next, frame),
  })
    .with({ hasFallenOut: true }, () => states)
    .with({ hasSettled: true }, () => [...states, next])
    .otherwise(() => advance(flight, next, frame + 1, [...states, next]));
};

export const simulatePlan = (
  tiles: Level,
  plan: MovePlan,
  player: Player,
): Player[] => advance({ tiles, plan }, player, 0, []);
