import { constant, flatMap, size, times } from 'lodash-es';
import { MAX_LIGHT_OCCLUDERS } from '../consts';
import type { LightOccluder } from '../types/light-occluder';

const FLOATS_PER_OCCLUDER = 4;

export const createLightOccluderFloats = (
  occluders: LightOccluder[],
): Float32Array =>
  Float32Array.from([
    ...flatMap(occluders, ({ x, y, width, height }) => [x, y, width, height]),
    ...times(
      (MAX_LIGHT_OCCLUDERS - size(occluders)) * FLOATS_PER_OCCLUDER,
      constant(0),
    ),
  ]);
