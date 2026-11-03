import { match } from 'ts-pattern';
import type { CanvasCall } from '../types/canvas-call';
import type { RecordingGlOptions } from '../types/recording-gl-options';

export const toRecordingGlMember =
  (calls: CanvasCall[], name: string, options: RecordingGlOptions) =>
  (...args: unknown[]): unknown =>
    match(name)
      .with('getProgramParameter', () => options.isLinked ?? true)
      .with('isContextLost', () => options.isLost ?? false)
      .with('getParameter', () => options.renderer ?? 'Test GPU')
      .with('getUniformLocation', () => `location:${String(args[1])}`)
      .with('createProgram', () => 'program')
      .with('createTexture', () => 'texture')
      .with('createShader', () => `shader:${String(args[0])}`)
      .with('getExtension', () =>
        match(options.hasLoseContext ?? true)
          .with(true, () => ({
            loseContext: () => calls.push({ name: 'loseContext', args: [] }),
          }))
          .otherwise(() => null),
      )
      .otherwise(() => calls.push({ name, args }));
