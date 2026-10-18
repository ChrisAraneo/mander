import type { GameState } from '@mander/engine';
import { findKeyTile, KEY_ENTITY_BOX, type Rectangle } from '@mander/model';
import { constant } from 'lodash-es';
import { match } from 'ts-pattern';
import { findEntityRectangle } from '../entity/find-entity-rectangle';

export const findKeyRectangle = (state: GameState): Rectangle | undefined =>
  match(state.hasKey)
    .with(true, constant(undefined))
    .otherwise(() =>
      findEntityRectangle(findKeyTile(state.level), KEY_ENTITY_BOX),
    );
