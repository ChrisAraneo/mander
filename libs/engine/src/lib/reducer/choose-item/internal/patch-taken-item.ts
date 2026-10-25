import { type Item, type Player } from '@mander/model';
import { concat } from 'lodash-es';
import { pipe } from 'remeda';
import type { GameState } from '../../../types/game-state';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { getBulletsAmount } from '../get-bullets-amount';
import { getScoreAmount } from '../get-score-amount';
import { getStarsAmount } from '../get-stars-amount';
import { getHeartsAmount } from './get-hearts-amount';

export const patchTakenItem = (state: GameState, item: Item): GameState =>
  pipe(
    createBasePlayerVelocity(),
    (basePlayerVelocity): Player => ({
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
    }),
    (player): GameState => ({
      ...state,
      status: 'PLAYING',
      isChestOpened: true,
      isNearChest: false,
      inventory: concat(state.inventory, item),
      score: state.score + getScoreAmount(item),
      ammo: state.ammo + getBulletsAmount(item),
      stars: state.stars + getStarsAmount(item),
      player,
    }),
  );
