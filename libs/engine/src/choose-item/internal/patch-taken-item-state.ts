import { concat } from 'lodash-es';
import { getBulletsAmount } from '../../item/get-bullets-amount';
import { getScoreAmount } from '../../item/get-score-amount';
import { getStarsAmount } from '../../item/get-stars-amount';
import type { GameState } from '../../state/types/game-state';
import type { TakenItemPlayer } from './types/taken-item-player';

export const patchTakenItemState = ({
  state,
  item,
  player,
}: TakenItemPlayer): GameState => ({
  ...state,
  status: 'PLAYING',
  isChestOpened: true,
  isNearChest: false,
  inventory: concat(state.inventory, item),
  score: state.score + getScoreAmount(item),
  ammo: state.ammo + getBulletsAmount(item),
  stars: state.stars + getStarsAmount(item),
  player,
});
