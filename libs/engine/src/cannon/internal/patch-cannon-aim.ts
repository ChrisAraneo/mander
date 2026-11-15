import type { Cannon, Player } from '@mander/model';
import { isPlayerRightOfCannon } from './is-player-right-of-cannon';

export const patchCannonAim = (cannon: Cannon, player: Player): Cannon => ({
  ...cannon,
  statuses: { isFacingRight: isPlayerRightOfCannon(cannon, player) },
});
