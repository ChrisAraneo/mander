import type { Player } from '@mander/model';

export const patchLostHeart = (hearts: Player['hearts']): Player['hearts'] => ({
  ...hearts,
  value: Math.max(0, hearts.value - 1),
});
