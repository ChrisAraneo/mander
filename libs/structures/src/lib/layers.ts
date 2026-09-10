import type { Layer, Sector } from './structure';

export const frontOf = (sector: Sector): Layer => sector[0];

export const backOf = (sector: Sector): Layer => sector[1];
