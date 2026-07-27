import { type TileMap, TILE_SIZE } from '../world';
import { match } from 'ts-pattern';

import { stepPlayer } from '../physics/step-player';
import type { Player } from '../state';
import {
  FRAME_SECONDS,
  MAX_GROUNDED_FRAMES,
  MAX_PLAN_FRAMES,
} from './internal-constants';
import { planInput } from './plan-input';
import type { MovePlan } from './move-plan';

interface Flight {
  tiles: TileMap;
  plan: MovePlan;
}

const hasFallenOut = (tiles: TileMap, player: Player): boolean =>
  player.y > tiles.height * TILE_SIZE;

const hasSettled = (previous: Player, next: Player, frame: number): boolean =>
  (next.isGrounded && previous.isGrounded === false) ||
  (next.isGrounded && frame + 1 >= MAX_GROUNDED_FRAMES) ||
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
  tiles: TileMap,
  plan: MovePlan,
  player: Player,
): Player[] => advance({ tiles, plan }, player, 0, []);
