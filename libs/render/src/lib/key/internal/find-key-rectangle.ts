import type { GameState } from '@mander/engine';
import { findKeyTile, getEntityRectangle, KEY_ENTITY_BOX } from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { not, nullish } = P;

export const findKeyRectangle = (state: GameState): Rectangle | undefined =>
  match({ hasKey: state.hasKey, tile: findKeyTile(state.level) })
    .with({ hasKey: false, tile: not(nullish) }, ({ tile }) =>
      getEntityRectangle(tile, KEY_ENTITY_BOX),
    )
    .otherwise(constant(undefined));
