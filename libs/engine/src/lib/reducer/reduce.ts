import { concat } from 'lodash-es';

import type { Action } from '../actions';
import type { GameState } from '../state';
import { createEnemies, createPlayer } from '../state';
import { tick } from './tick';
import { withInput } from './with-input';

export function reduce(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'TICK': {
      return tick(state, action.deltaSeconds);
    }

    case 'MOVE_LEFT_START': {
      return withInput(state, { left: true });
    }
    case 'MOVE_LEFT_STOP': {
      return withInput(state, { left: false });
    }
    case 'MOVE_RIGHT_START': {
      return withInput(state, { right: true });
    }
    case 'MOVE_RIGHT_STOP': {
      return withInput(state, { right: false });
    }

    case 'JUMP_START': {
      if (state.input.jump) return state;
      return {
        ...withInput(state, { jump: true }),
        player:
          state.status === 'playing'
            ? { ...state.player, jumpQueued: true }
            : state.player,
      };
    }
    case 'JUMP_STOP': {
      return withInput(state, { jump: false });
    }

    case 'INTERACT': {
      if (state.status !== 'playing') return state;
      if (state.nearChest && state.hasKey) return { ...state, status: 'chest' };
      if (state.nearPortal) return { ...state, status: 'complete' };
      return state;
    }

    case 'CHOOSE_ITEM': {
      if (state.status !== 'chest') return state;
      const item = state.level.chestItems[action.index];
      if (!item) return state;
      return {
        ...state,
        status: 'playing',
        chestOpened: true,
        nearChest: false,
        inventory: concat(state.inventory, item),
      };
    }

    case 'CLOSE': {
      if (state.status !== 'chest') return state;
      return { ...state, status: 'playing' };
    }

    case 'RESPAWN': {
      if (state.status !== 'playing') return state;
      return { ...state, player: createPlayer(state.level) };
    }

    case 'LOAD_LEVEL': {
      return {
        ...state,
        level: action.level,
        levelIndex: action.levelIndex,
        player: createPlayer(action.level),
        enemies: createEnemies(action.level),
        status: 'playing',
        hasKey: false,
        chestOpened: false,
        nearChest: false,
        nearPortal: false,
        time: 0,
      };
    }
  }
}
