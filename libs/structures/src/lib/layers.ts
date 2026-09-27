import type { Layer, Sector } from './structure';

export const getFront = (sector: Sector): Layer => sector[0];

export const getBack = (sector: Sector): Layer => sector[1];
