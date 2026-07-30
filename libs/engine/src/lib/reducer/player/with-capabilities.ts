import type { Player } from '@mander/model';

export const withCapabilities = (
  player: Player,
  capabilities: Player['velocity'],
): Player => ({
  ...player,
  velocity: {
    x: { ...player.velocity.x, max: capabilities.x.max },
    y: { ...player.velocity.y, max: capabilities.y.max },
  },
});
