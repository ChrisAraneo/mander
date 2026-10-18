import { match } from 'ts-pattern';

const JAW_OPEN_TILT = 0.65;

const JAW_SHUT_TILT = 0.12;

export const getBeartrapJawTilt = (isSnapped: boolean): number =>
  match(isSnapped)
    .with(true, () => JAW_SHUT_TILT)
    .otherwise(() => -JAW_OPEN_TILT);
