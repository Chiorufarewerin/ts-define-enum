import { describe, it, expectTypeOf } from 'vitest';
import { defineEnum } from '../src';
import type { DefinedEnum } from '../src';

describe('defineEnum types', () => {
  it('infers union from values', () => {
    type Color = (typeof Color)['values'][number];
    const Color = defineEnum({
      Green: 'GREEN',
      Red: 'RED',
    });

    expectTypeOf<Color>().toEqualTypeOf<'GREEN' | 'RED'>();

    expectTypeOf(Color.enum).toEqualTypeOf<{
      readonly Green: 'GREEN';
      readonly Red: 'RED';
    }>();

    expectTypeOf(Color.keys).toEqualTypeOf<readonly ['Green', 'Red']>();
    expectTypeOf(Color.values).toEqualTypeOf<readonly ['GREEN', 'RED']>();
  });

  it('correctly returns method type', () => {
    type Status = (typeof Status)['values'][number];
    const Status = defineEnum({
      pending: 'pending',
      done: 'done',

      createLabel() {
        const labels: Readonly<Record<Status, string>> = {
          [this.pending]: 'Pending status',
          [this.done]: 'Done status',
        };

        return (status: Status) => labels[status];
      },
    });

    expectTypeOf(Status.createLabel).toEqualTypeOf<(s: Status) => string>();

    expectTypeOf(Status).toExtend<DefinedEnum>();
  });

  it('is() narrows type', () => {
    const Color = defineEnum({
      Green: 'GREEN',
      Red: 'RED',
    });

    type ColorValue = (typeof Color)['values'][number];

    let value: string | number = 'GREEN';

    if (Color.is(value)) {
      expectTypeOf<typeof value>().toEqualTypeOf<ColorValue>();
    }
  });
});
