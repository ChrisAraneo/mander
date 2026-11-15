import type { TickHazards } from './tick-hazards';

export type CarriedHazards = Omit<TickHazards, 'moved' | 'steppedEnemies'>;
