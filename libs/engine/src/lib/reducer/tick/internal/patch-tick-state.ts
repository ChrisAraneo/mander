import {
  CHEST_ENTITY_BOX,
  findChestTile,
  findKeyTile,
  findPortalTile,
  KEY_ENTITY_BOX,
  PORTAL_ENTITY_BOX,
} from '@mander/model';
import { size } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { GEM_SCORE } from '../../score/consts';
import { PICKUP_RANGE } from '../consts';
import { isNearTile } from './is-near-tile';
import type { TickEntities } from './types/tick-entities';

const INTERACT_RANGE = 12;

export const patchTickState = ({
  state,
  deltaSeconds,
  cannons,
  fireballs,
  playerFireballs,
  player,
  deaths,
  status,
  bullets,
  unshot,
  level,
  enemies,
  cannonballs,
  canReach,
  gems,
}: TickEntities): GameState => ({
  ...state,
  level,
  player,
  enemies,
  cannons,
  cannonballs,
  fallingSpikes: unshot,
  fireballs,
  playerFireballs,
  bullets,
  gems,
  deaths,
  status,
  time: state.time + deltaSeconds,
  score: state.score + (size(state.gems) - size(gems)) * GEM_SCORE,
  hasKey:
    state.hasKey ||
    (canReach &&
      isNearTile(
        player,
        findKeyTile(state.level),
        KEY_ENTITY_BOX,
        PICKUP_RANGE,
      )),
  isNearChest:
    !state.isChestOpened &&
    canReach &&
    isNearTile(
      player,
      findChestTile(state.level),
      CHEST_ENTITY_BOX,
      INTERACT_RANGE,
    ),
  isNearPortal:
    canReach &&
    isNearTile(
      player,
      findPortalTile(state.level),
      PORTAL_ENTITY_BOX,
      INTERACT_RANGE,
    ),
});
