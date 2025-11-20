import { describe, it, expect } from 'vitest';

import { defineEnum } from '../src';

describe('defineEnum runtime', () => {
  it('creates simple enum', () => {
    type Color = (typeof Color)['values'][number];
    const Color = defineEnum({
      Green: 'GREEN',
      Red: 'RED',
    });

    expect(Color.Green).toBe('GREEN');
    expect(Color.Red).toBe('RED');

    expect(Color.keys).toEqual(['Green', 'Red']);
    expect(Color.values).toEqual(['GREEN', 'RED']);

    expect(Object.keys(Color.enum)).toEqual(['Green', 'Red']);
    expect(Color.enum.Green).toBe('GREEN');

    expect(Color.is('GREEN')).toBe(true);
    expect(Color.is('BLUE')).toBe(false);
    expect(Color.is(42)).toBe(false);
  });

  it('finds methods and does not include them into keys/values/enum', () => {
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

    expect(typeof Status.createLabel).toBe('function');
    expect(Status.createLabel('done')).toBe('Done status');
    expect(Status.createLabel('pending')).toBe('Pending status');

    expect(Status.keys).toEqual(['pending', 'done']);
    expect(Status.values).toEqual(['pending', 'done']);
    expect(Object.keys(Status.enum)).toEqual(['pending', 'done']);
  });
});
