import type { FileController } from '@/controller/file'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DataController } from './data'

describe('processData', () => {
  const data = new DataController({} as FileController)

  it('groups multi-dash names under the exchange suffix', () => {
    const csv = [
      'Market and Exchange Names,As of Date in Form YYYY-MM-DD',
      '"PG&E - CITYGATE (INDEX) - ICE FUTURES ENERGY DIV",2024-01-02',
      '"EURO FX - CHICAGO MERCANTILE EXCHANGE",2024-01-02',
    ].join('\n')

    const catalog = data.processData(csv)

    assert.ok(catalog['ICE FUTURES ENERGY DIV']?.['PG&E - CITYGATE (INDEX)'])
    assert.ok(catalog['CHICAGO MERCANTILE EXCHANGE']?.['EURO FX'])
    assert.equal(catalog['CITYGATE (INDEX)'], undefined)
  })
})
