import React from 'react'

export interface DataTableProps {
  averagePeriod: number,
  values: (string|number)[][]
}

/**
 * Returns function that calculates average, and returns
 * formatted value in locale string, for the chosen row.
 * See test in DataTable.test.tsx
 */
export const getAverage = (period: number, values: DataTableProps['values']) =>
  (rowIndex: number): string => {
    const sum = values
      .slice(0, period)
      .reduce((total, row) => total + Number(row[rowIndex]), 0)
    return Math.trunc(sum / period).toLocaleString()
  }

export const DataTable = ({ averagePeriod, values }: DataTableProps): JSX.Element => {
  const _getAverage = getAverage(averagePeriod, values)
  const longAverage = _getAverage(1)
  const shortAverage = _getAverage(2)
  const longPercentageAverage = _getAverage(5)
  const shortPercentageAverage = _getAverage(6)
  const netAverage = _getAverage(7)
  return (
    <table className='table table-bordered text-center' style={{ marginTop: 10 }}>
      <thead className='thead-dark'>
        <tr>
          <th scope='col'>DATE</th>
          <th scope='col'>LONG</th>
          <th scope='col'>SHORT</th>
          <th scope='col'>CHANGE LONG</th>
          <th scope='col'>CHANGE SHORT</th>
          <th scope='col'>% LONG</th>
          <th scope='col'>% SHORT</th>
          <th scope='col'>NET POSITIONS</th>
        </tr>
      </thead>
      <tbody>
        {
          values.length >= averagePeriod && (
            <tr className='bg-light'>
              <td title={`${averagePeriod} Period Simple Average`}>
                Average({averagePeriod})
              </td>
              <td>{longAverage}</td>
              <td>{shortAverage}</td>
              <td colSpan={2} ></td>
              <td>{longPercentageAverage} %</td>
              <td>{shortPercentageAverage} %</td>
              <td>{netAverage}</td>
            </tr>
          )
        }
        {
          values.map((row, valueIndex) =>
            <tr key={valueIndex}>
              {row.map((column, index) => {
                // Add classname to make table cell red/green depending if the value increased/decreased
                let className = ''

                if (values[valueIndex + 1] && (index === 1 || index === 2 || index === 7)) {
                  const previousColumn = values[valueIndex + 1][index]
                  if (previousColumn > column) className = 'column-negative'
                  if (previousColumn < column) className = 'column-positive'
                }

                // Some values are come blank in the COT CSV file (not available)
                let text = Number.isNaN(column) ? 'Not Available' : column

                // Format numbers for better readability
                if (index >= 1 || index <= 4 || index === 7) text = text.toLocaleString()
                if (index === 5 || index === 6) text = text + ' %'

                return <td className={className} key={index}>{text}</td>
              })}
            </tr>
          )
        }
      </tbody>
    </table>
  )
}
