import type { AverageInput } from '@/controller/data'
import type { ReactNode } from 'react'
import { useController } from './controller-context'

export function DataTable(props: AverageInput): ReactNode {
  const { data } = useController()

  const getAverageWithIndex = data.getAverage(props)
  const longAverage = getAverageWithIndex(1)
  const shortAverage = getAverageWithIndex(2)
  const longPercentageAverage = getAverageWithIndex(5)
  const shortPercentageAverage = getAverageWithIndex(6)
  const netAverage = getAverageWithIndex(7)

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
        {props.values.length >= props.averagePeriod && (
          <tr className="bg-light">
            <td title={`${props.averagePeriod} Period Simple Average`}>
              Average(
              {props.averagePeriod}
              )
            </td>
            <td>{longAverage}</td>
            <td>{shortAverage}</td>
            <td colSpan={2}></td>
            <td>
              {longPercentageAverage}
              {' '}
              %
            </td>
            <td>
              {shortPercentageAverage}
              {' '}
              %
            </td>
            <td>{netAverage}</td>
          </tr>
        )}
        {props.values.map((row, valueIndex) => (
          <tr key={valueIndex}>
            {row.map((column, index) => {
              // Add classname to make table cell red/green
              // depending if the value increased/decreased
              let className = ''

              if (
                props.values[valueIndex + 1] !== undefined
                && (index === 1 || index === 2 || index === 7)
              ) {
                const previousColumn = props.values[valueIndex + 1][index]
                if (previousColumn > column) {
                  className = 'column-negative'
                }
                if (previousColumn < column) {
                  className = 'column-positive'
                }
              }

              // Some values are blank (not available) in COT's CSV
              let text = Number.isNaN(column) ? 'Not Available' : column

              // Format numbers for better readability
              if (index >= 1 || index <= 4 || index === 7) {
                text = text.toLocaleString()
              }
              if (index === 5 || index === 6) {
                text = `${text} %`
              }

              return (
                <td className={className} key={index}>
                  {text}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
