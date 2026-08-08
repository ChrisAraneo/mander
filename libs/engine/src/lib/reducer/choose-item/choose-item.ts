import { concat } from 'lodash-es';
import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { capabilitiesFor } from '../player/capabilities-for';
import { withCapabilities } from '../player/with-capabilities';
import { getScoreAmount } from './get-score-amount';
import { getHeartsAmount } from './get-hearts-amount';

export const chooseItem = (state: GameState, index: number): GameState =>
  match(state.status)
    .with('CHEST', (): GameState => {
      return match(index >= 0 && index < state.level.chestItems.length)
        .with(true, (): GameState => ({
          ...state,
          status: 'PLAYING',
          isChestOpened: true,
          isNearChest: false,
          inventory: concat(state.inventory, state.level.chestItems[index]),
          score: state.score + getScoreAmount(state.level.chestItems[index]),
          player: withCapabilities(
            {
              ...state.player,
              hearts: {
                ...state.player.hearts,
                value:
                  state.player.hearts.value +
                  getHeartsAmount(state.level.chestItems[index]),
              },
            },
            capabilitiesFor(),
          ),
        }))
        .otherwise((): GameState => state);
    })
    .otherwise((): GameState => state);
