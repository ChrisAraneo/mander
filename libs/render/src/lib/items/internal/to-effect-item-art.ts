import type { Item } from '@mander/model';
import { match } from 'ts-pattern';
import { RED_GEM_COLORS } from '../../gem-shape/consts';
import type { ItemArt } from '../types/item-art';
import { createBulletsArt } from './create-bullets-art';
import { createFireballsArt } from './create-fireballs-art';
import { createGemArt } from './create-gem-art';
import { createHeartsArt } from './create-hearts-art';
import { createStarsArt } from './create-stars-art';
import { createWardArt } from './create-ward-art';

export const toEffectItemArt = (item: Item): ItemArt =>
  match(item.effect)
    .with({ kind: 'NONE' }, () => createGemArt(RED_GEM_COLORS))
    .with({ kind: 'HEART' }, ({ amount }) => createHeartsArt(amount))
    .with({ kind: 'SCORE' }, () => createGemArt(RED_GEM_COLORS))
    .with({ kind: 'STAR' }, ({ amount }) => createStarsArt(amount))
    .with({ kind: 'BULLET' }, ({ amount }) => createBulletsArt(amount))
    .with({ kind: 'FIREBALL' }, ({ amount }) => createFireballsArt(amount))
    .with({ kind: 'WARD' }, ({ hazard }) => createWardArt(hazard))
    .exhaustive();
