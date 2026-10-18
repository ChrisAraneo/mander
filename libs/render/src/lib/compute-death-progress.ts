import { clamp } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { number } = P;

export const computeDeathProgress = (
  death: number | null,
  durationSeconds: number,
): number =>
  match(death)
    .with(number, (seconds) => clamp(seconds / durationSeconds, 0, 1))
    .otherwise(() => 0);
