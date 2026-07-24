import { match, P } from 'ts-pattern';

export const maxJumpColumns = (rise: number): number =>
  match(rise)
    .with(P.number.lte(-1), () => 6)
    .with(0, () => 5)
    .with(1, () => 4)
    .with(2, () => 4)
    .with(3, () => 3)
    .with(4, () => 2)
    .otherwise(() => 0);
