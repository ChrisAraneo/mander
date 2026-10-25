import type { Layer } from './types/layer';
import type { Sector } from './types/sector';

export const getFront = (sector: Sector): Layer => sector[0];
