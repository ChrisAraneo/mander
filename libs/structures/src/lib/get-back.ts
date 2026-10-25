import type { Layer } from './types/layer';
import type { Sector } from './types/sector';

export const getBack = (sector: Sector): Layer => sector[1];
