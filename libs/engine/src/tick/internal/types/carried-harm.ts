import type { TickHarm } from './tick-harm';

export type CarriedHarm = Omit<
  TickHarm,
  'fallingSpikes' | 'flyingBullets' | 'afterStomps' | 'gored'
>;
