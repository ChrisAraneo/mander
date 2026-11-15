import { RED_GEM } from '@mander/model';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameState } from '../state/types/game-state';
import { createRespawnTestLevel } from './create-respawn-test-level';

const PLAYER_X = 200;

const PLAYER_Y = 10;

const CARRIED_HEARTS = 1;

const CANNONBALL_X = 100;

const CANNONBALL_Y = 64;

const CANNONBALL_SPEED = 5;

const BULLET_X = 120;

const BULLET_Y = 64;

const BULLET_SPEED = 8;

const CARRIED_SCORE = 40;

const CARRIED_TIME = 12;

const CARRIED_DEATHS = 2;

export const createRespawnTestState = (): GameState => ({
  ...createInitialState(createRespawnTestLevel(), FIRST_LEVEL_INDEX, [RED_GEM]),
  player: {
    ...createInitialState(createRespawnTestLevel(), FIRST_LEVEL_INDEX, [
      RED_GEM,
    ]).player,
    position: { x: PLAYER_X, y: PLAYER_Y },
    hearts: { value: CARRIED_HEARTS },
  },
  enemies: [],
  cannons: [],
  cannonballs: [
    {
      position: { x: CANNONBALL_X, y: CANNONBALL_Y },
      velocity: {
        x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
        y: { current: 0, max: CANNONBALL_SPEED },
      },
    },
  ],
  fallingSpikes: [],
  fireballs: [],
  bullets: [
    {
      position: { x: BULLET_X, y: BULLET_Y },
      velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
    },
  ],
  score: CARRIED_SCORE,
  time: CARRIED_TIME,
  deaths: CARRIED_DEATHS,
});
