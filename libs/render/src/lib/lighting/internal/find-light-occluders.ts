import {
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '@mander/engine';
import { filter, isNil, map, take } from 'lodash-es';
import { pipe } from 'remeda';
import { MAX_LIGHT_OCCLUDERS } from '../consts';
import type { LightOccluder } from '../types/light-occluder';
import type { LightingScene } from '../types/lighting-scene';
import { isLightOccluderInView } from './is-light-occluder-in-view';

export const findLightOccluders = (scene: LightingScene): LightOccluder[] =>
  pipe(
    [
      ...map(
        filter([scene.state.player], ({ timers }) => isNil(timers.death)),
        ({ position }): LightOccluder => ({
          ...position,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
        }),
      ),
      ...map(
        filter(
          scene.state.enemies,
          ({ kind, timers }) => kind !== 'BEARTRAP' && isNil(timers.death),
        ),
        ({ position }): LightOccluder => ({
          ...position,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
        }),
      ),
    ],
    (occluders) =>
      filter(occluders, (occluder) => isLightOccluderInView(occluder, scene)),
    (occluders) => take(occluders, MAX_LIGHT_OCCLUDERS),
  );
