import { chain } from '@mander/model';
import { includes, tap } from 'lodash-es';
import { match } from 'ts-pattern';
import { createRecordedGradient } from './internal/create-recorded-gradient';
import type { CanvasCall } from './types/canvas-call';
import type { RecordingContext } from './types/recording-context';

const GRADIENT_FACTORIES: readonly string[] = Object.freeze([
  'createLinearGradient',
  'createRadialGradient',
]);

export const createRecordingContext = (): RecordingContext =>
  chain([])
    .thru((calls: CanvasCall[]): RecordingContext => ({
      calls,
      context: new Proxy(
        {},
        {
          get:
            (_, name) =>
            (...args: unknown[]): CanvasGradient | number =>
              match(includes(GRADIENT_FACTORIES, name))
                .with(true, () =>
                  createRecordedGradient(calls, String(name), args),
                )
                .otherwise(() => calls.push({ name: String(name), args })),
          set: (_, name, value) =>
            tap(true, () =>
              calls.push({ name: `set ${String(name)}`, args: [value] }),
            ),
        },
      ) as unknown as CanvasRenderingContext2D,
    }))
    .value();
