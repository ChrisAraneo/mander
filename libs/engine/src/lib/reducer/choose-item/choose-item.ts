import { chain, concat } from 'lodash-es';
import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { getBulletsAmount } from './get-bullets-amount';
import { getScoreAmount } from './get-score-amount';
import { getStarsAmount } from './get-stars-amount';
import { getHeartsAmount } from './get-hearts-amount';

export const chooseItem = (state: GameState, index: number): GameState =>
  match(state.status)
    .with('CHEST', (): GameState =>
      match(index >= 0 && index < state.level.chestItems.length)
        .with(true, (): GameState =>
          chain(createBasePlayerVelocity())
            .thru((basePlayerVelocity): GameState => ({
              ...state,
              status: 'PLAYING',
              isChestOpened: true,
              isNearChest: false,
              inventory: concat(state.inventory, state.level.chestItems[index]),
              score:
                state.score + getScoreAmount(state.level.chestItems[index]),
              ammo:
                state.ammo + getBulletsAmount(state.level.chestItems[index]),
              stars:
                state.stars + getStarsAmount(state.level.chestItems[index]),
              player: {
                ...state.player,
                hearts: {
                  ...state.player.hearts,
                  value:
                    state.player.hearts.value +
                    getHeartsAmount(state.level.chestItems[index]),
                },
                velocity: {
                  ...state.player.velocity,
                  x: {
                    ...state.player.velocity.x,
                    max: basePlayerVelocity.x.max,
                  },
                  y: {
                    ...state.player.velocity.y,
                    max: basePlayerVelocity.y.max,
                  },
                },
              },
            }))
            .value(),
        )
        .otherwise((): GameState => state),
    )
    .otherwise((): GameState => state);
