import type { Item } from '@mander/model';

export const isStar = (item: Item): boolean => item.effect.kind === 'STAR';
