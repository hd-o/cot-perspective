import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseMarketAndExchange } from './market-name'

describe('parseMarketAndExchange', () => {
  it('splits a single-separator CFTC name', () => {
    assert.deepEqual(
      parseMarketAndExchange('EURO FX - CHICAGO MERCANTILE EXCHANGE'),
      { market: 'EURO FX', exchange: 'CHICAGO MERCANTILE EXCHANGE' },
    )
  })

  it('keeps extra dashes in the market by splitting on the last separator', () => {
    const cases = [
      [
        'PG&E - CITYGATE (INDEX) - ICE FUTURES ENERGY DIV',
        'PG&E - CITYGATE (INDEX)',
        'ICE FUTURES ENERGY DIV',
      ],
      [
        'DOMINION - SOUTH POINT - ICE FUTURES ENERGY DIV',
        'DOMINION - SOUTH POINT',
        'ICE FUTURES ENERGY DIV',
      ],
      [
        'DOMINION - SOUTH POINT (BASIS) - ICE FUTURES ENERGY DIV',
        'DOMINION - SOUTH POINT (BASIS)',
        'ICE FUTURES ENERGY DIV',
      ],
      [
        'ERCOT - NORTH MONTHLY OFF-PEAK - ICE FUTURES ENERGY DIV',
        'ERCOT - NORTH MONTHLY OFF-PEAK',
        'ICE FUTURES ENERGY DIV',
      ],
      [
        'SONAT - TIER 1 POOL (ZONE 0) - ICE FUTURES ENERGY DIV',
        'SONAT - TIER 1 POOL (ZONE 0)',
        'ICE FUTURES ENERGY DIV',
      ],
      [
        'S&P 500 Consolidated - EMINI S&P 500 - CHICAGO MERCANTILE EXCHANGE',
        'S&P 500 Consolidated - EMINI S&P 500',
        'CHICAGO MERCANTILE EXCHANGE',
      ],
    ] as const

    for (const [name, market, exchange] of cases) {
      assert.deepEqual(parseMarketAndExchange(name), { market, exchange })
    }
  })

  it('returns undefined when the name has no separator or a blank side', () => {
    assert.equal(parseMarketAndExchange('EURO FX'), undefined)
    assert.equal(parseMarketAndExchange(' - CHICAGO MERCANTILE EXCHANGE'), undefined)
    assert.equal(parseMarketAndExchange('EURO FX - '), undefined)
    assert.equal(parseMarketAndExchange(''), undefined)
  })
})
