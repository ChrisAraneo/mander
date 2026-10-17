import { type Fireball, MAX_TICK_SECONDS } from '@mander/model';
import { chain, type Point } from '@mander/utils';
import { times } from 'lodash-es';
import { PLAYER_FIREBALL_ANGULAR_SPEED } from '../consts';
import { getPlayerFireballPosition } from '../get-player-fireball-position';
import { computeSweptStepCount } from './compute-swept-step-count';
import { toSpinDirection } from './to-spin-direction';

export const computeSweptCentres = (
  fireball: Fireball,
  elapsedSeconds: number,
): readonly Point[] =>
  chain(
    PLAYER_FIREBALL_ANGULAR_SPEED * Math.min(elapsedSeconds, MAX_TICK_SECONDS),
  )
    .thru((sweptAngle) => ({
      sweptAngle,
      steps: computeSweptStepCount(sweptAngle),
    }))
    .thru(({ sweptAngle, steps }) =>
      times(steps + 1, (step) =>
        getPlayerFireballPosition({
          ...fireball,
          angle:
            fireball.angle -
            toSpinDirection(fireball.spin) * sweptAngle * (step / steps),
        }),
      ),
    )
    .value();
