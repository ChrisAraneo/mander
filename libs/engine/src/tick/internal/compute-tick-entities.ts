import { isAlive } from '../../player/is-alive';
import { createTickEntities } from './create-tick-entities';
import type { TickEntities } from './types/tick-entities';
import type { TickVolley } from './types/tick-volley';

export const computeTickEntities = ({
  player,
  ...volley
}: TickVolley): TickEntities =>
  createTickEntities({ ...volley, player }, isAlive(player));
