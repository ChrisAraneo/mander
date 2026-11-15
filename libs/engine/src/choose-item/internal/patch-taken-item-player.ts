import { getHeartsAmount } from '../../item/get-hearts-amount';
import type { TakenItemPlayer } from './types/taken-item-player';
import type { TakenItemVelocity } from './types/taken-item-velocity';

export const patchTakenItemPlayer = ({
  state,
  item,
  baseVelocity,
}: TakenItemVelocity): TakenItemPlayer => ({
  state,
  item,
  player: {
    ...state.player,
    hearts: {
      ...state.player.hearts,
      value: state.player.hearts.value + getHeartsAmount(item),
    },
    velocity: {
      ...state.player.velocity,
      x: { ...state.player.velocity.x, max: baseVelocity.x.max },
      y: { ...state.player.velocity.y, max: baseVelocity.y.max },
    },
  },
});
