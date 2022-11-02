import moment from 'moment';
import { HoldingPeriods, makePhantomEvent } from './event';

describe('Testing merging period', () => {
  it('should be merged holding period', () => {
    const periods: HoldingPeriods = [
      {
        from: moment({
          y: 2022,
          M: 11,
          d: 15,
          h: 10,
        }),
        to: moment({
          y: 2022,
          M: 11,
          d: 15,
          h: 22,
        }),
      },
      {
        from: moment({
          y: 2022,
          M: 11,
          d: 16,
          h: 13,
        }),
        to: moment({
          y: 2022,
          M: 11,
          d: 16,
          h: 22,
        }),
      },
      {
        from: moment({
          y: 2022,
          M: 11,
          d: 16,
          h: 10,
        }),
        to: moment({
          y: 2022,
          M: 11,
          d: 16,
          h: 14,
        }),
      },
    ];

    const event = makePhantomEvent(
      'test',
      'Test Event',
      periods,
    );

    expect(event.meta.holdingPeriods).toEqual([
      {
        from: moment({
          y: 2022,
          M: 11,
          d: 15,
          h: 10,
        }),
        to: moment({
          y: 2022,
          M: 11,
          d: 15,
          h: 22,
        }),
      },
      {
        from: moment({
          y: 2022,
          M: 11,
          d: 16,
          h: 10,
        }),
        to: moment({
          y: 2022,
          M: 11,
          d: 16,
          h: 22,
        }),
      },
    ]);
    expect(event.meta.totalPeriod).toEqual({
      from: moment({
        y: 2022,
        M: 11,
        d: 15,
        h: 10,
      }),
      to: moment({
        y: 2022,
        M: 11,
        d: 16,
        h: 22,
      }),
    });
  });
});