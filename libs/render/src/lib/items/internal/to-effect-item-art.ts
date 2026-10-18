import type { Item } from '@mander/model';
import { match } from 'ts-pattern';
import { RED_GEM_COLORS } from '../../gem-shape/consts';
import type { ItemArt } from '../types/item-art';
import { createCountedArt } from './create-counted-art';
import { createGemArt } from './create-gem-art';
import { createStarsArt } from './create-stars-art';
import { createWardArt } from './create-ward-art';

export const toEffectItemArt = (item: Item): ItemArt =>
  match(item.effect)
    .with({ kind: 'NONE' }, () => createGemArt(RED_GEM_COLORS))
    .with({ kind: 'HEART' }, ({ amount }) => createCountedArt('HEARTS', amount))
    .with({ kind: 'SCORE' }, () => createGemArt(RED_GEM_COLORS))
    .with({ kind: 'STAR' }, ({ amount }) => createStarsArt(amount))
    .with({ kind: 'BULLET' }, ({ amount }) =>
      createCountedArt('BULLETS', amount),
    )
    .with({ kind: 'FIREBALL' }, ({ amount }) =>
      createCountedArt('FIREBALLS', amount),
    )
    .with({ kind: 'WARD' }, ({ hazard }) => createWardArt(hazard))
    .exhaustive();
