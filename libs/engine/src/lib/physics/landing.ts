import { match } from 'ts-pattern';

export interface Landing {
  grounded: boolean;
  vy: number;
}

export const resolveLanding = (
  blocked: boolean,
  falling: boolean,
  grounded: boolean,
  vy: number,
): Landing =>
  match({ blocked, falling })
    .with({ blocked: true, falling: true }, () => ({ grounded: true, vy: 0 }))
    .with({ blocked: true, falling: false }, () => ({ grounded, vy: 0 }))
    .with({ blocked: false, falling: true }, () => ({ grounded: false, vy }))
    .with({ blocked: false, falling: false }, () => ({ grounded, vy }))
    .exhaustive();
