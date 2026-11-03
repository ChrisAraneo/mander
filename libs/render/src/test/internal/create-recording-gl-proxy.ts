import { toUpper } from 'lodash-es';
import { match } from 'ts-pattern';
import type { CanvasCall } from '../types/canvas-call';
import type { RecordingGlOptions } from '../types/recording-gl-options';
import { toRecordingGlMember } from './to-recording-gl-member';

export const createRecordingGlProxy = (
  calls: CanvasCall[],
  options: RecordingGlOptions,
): WebGL2RenderingContext =>
  new Proxy(
    {},
    {
      get: (_, name) =>
        match(String(name) === toUpper(String(name)))
          .with(true, () => String(name))
          .otherwise(() => toRecordingGlMember(calls, String(name), options)),
    },
  ) as unknown as WebGL2RenderingContext;
