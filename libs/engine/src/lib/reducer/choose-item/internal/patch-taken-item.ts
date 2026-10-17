import type { Item } from '@mander/model';
import { chain } from '@mander/utils';
import { concat } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { createPlayerFireballs } from '../../fireball/create-player-fireballs';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { getBulletsAmount } from '../get-bullets-amount';
import { getScoreAmount } from '../get-score-amount';
import { getStarsAmount } from '../get-stars-amount';
import { getHeartsAmount } from './get-hearts-amount';

export const patchTakenItem = (state: GameState, item: Item): GameState =>
  chain({
    inventory: concat(state.inventory, item),
    basePlayerVelocity: createBasePlayerVelocity(),
  })
    .thru(({ inventory, basePlayerVelocity }): GameState => ({
      ...state,
      status: 'PLAYING',
      isChestOpened: true,
      isNearChest: false,
      inventory,
      playerFireballs: createPlayerFireballs(
        inventory,
        state.player,
        state.isMoonMagnetOn,
      ),
      score: state.score + getScoreAmount(item),
      ammo: state.ammo + getBulletsAmount(item),
      stars: state.stars + getStarsAmount(item),
      player: {
        ...state.player,
        hearts: {
          ...state.player.hearts,
          value: state.player.hearts.value + getHeartsAmount(item),
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
    .value();
