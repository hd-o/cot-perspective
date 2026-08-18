import type { AverageInput } from '@/controller/table-data'
import type { ReactNode } from 'react'
import {
  averageOf,
  formatAverageContracts,
  formatContracts,
  formatPercent,
  trendClass,
} from '@/controller/table-data'

export function DataTable(props: AverageInput): ReactNode {
  const { averagePeriod, values } = props
  const longAverage = formatAverageContracts(averageOf(values, averagePeriod, 'long'))
  const shortAverage = formatAverageContracts(averageOf(values, averagePeriod, 'short'))
  const longPercentageAverage = formatPercent(averageOf(values, averagePeriod, 'percentLong'))
  const shortPercentageAverage = formatPercent(averageOf(values, averagePeriod, 'percentShort'))
  const netAverage = formatAverageContracts(averageOf(values, averagePeriod, 'net'))

  return (
    <table
      className="table table-bordered text-center"
      style={{ marginTop: 10 }}
    >
      <thead className="thead-dark">
        <tr>
          <th scope="col">DATE</th>
          <th scope="col">LONG</th>
          <th scope="col">SHORT</th>
          <th scope="col">CHANGE LONG</th>
          <th scope="col">CHANGE SHORT</th>
          <th scope="col">% LONG</th>
          <th scope="col">% SHORT</th>
          <th scope="col">NET POSITIONS</th>
        </tr>
      </thead>
      <tbody>
        {values.length >= averagePeriod && (
          <tr className="bg-light">
            <td title={`${averagePeriod}-week simple average`}>
              {`${averagePeriod}-week average`}
            </td>
            <td>{longAverage}</td>
            <td>{shortAverage}</td>
            <td colSpan={2}></td>
            <td>{longPercentageAverage}</td>
            <td>{shortPercentageAverage}</td>
            <td>{netAverage}</td>
          </tr>
        )}
        {values.map((row, valueIndex) => {
          const previous = values[valueIndex + 1]
          return (
            <tr key={row.date}>
              <td>{row.date}</td>
              <td className={trendClass(row.long, previous?.long)}>
                {formatContracts(row.long)}
              </td>
              <td className={trendClass(row.short, previous?.short)}>
                {formatContracts(row.short)}
              </td>
              <td>{formatContracts(row.changeLong)}</td>
              <td>{formatContracts(row.changeShort)}</td>
              <td>{formatPercent(row.percentLong)}</td>
              <td>{formatPercent(row.percentShort)}</td>
              <td className={trendClass(row.net, previous?.net)}>
                {formatContracts(row.net)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
