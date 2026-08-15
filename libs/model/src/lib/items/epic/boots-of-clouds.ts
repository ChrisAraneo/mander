import type { Item } from '../item';

export const BOOTS_OF_CLOUDS: Item = {
  id: 'BOOTS_OF_CLOUDS',
  name: 'Boots of Clouds',
  description: 'Walk straight over the spikes and feel nothing',
  rarity: 'EPIC',
  effect: { kind: 'WARD', hazard: 'FLOOR_SPIKE' },
};
