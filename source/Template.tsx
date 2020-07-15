import React, { ReactNode } from 'react'
import fs from 'fs'
import CleanCSS from 'clean-css'
import { getPagePath } from './getFileName'
import { traderCategories } from './processTableData'
import { COTData } from './processData'

const license = fs.readFileSync('./LICENSE').toString()
const stylesInput = fs.readFileSync('./source/styles.css').toString()
const styles = new CleanCSS().minify(stylesInput).styles

const Select = ({ children }: { children: ReactNode }) => (
  <select className='custom-select form-control js-dropdown-select'>
    {children}
  </select>
)

export interface DataTableProps {
  data: COTData,
  averagePeriod: number,
  values: (string|number)[][],
  markets: string[],
  exchanges: string[],
  traderCategories: typeof traderCategories,
  selectedExchange: string,
  selectedMarket: string,
  selectedTraderCategory: string
}

const getAverage = (
  averagePeriod: number,
  values: DataTableProps['values']
) => (rowIndex: number) => (
  Math
    .trunc(values
      .slice(0, averagePeriod)
      .reduce((total, row) => total + Number(row[rowIndex]), 0) /
      12)
    .toLocaleString()
)

const DataTable = ({
  data,
  averagePeriod,
  values,
  markets,
  exchanges,
  traderCategories,
  selectedExchange,
  selectedMarket,
  selectedTraderCategory
}: DataTableProps) => {
  const _getAverage = getAverage(averagePeriod, values)
  const longAverage = _getAverage(1)
  const shortAverage = _getAverage(2)
  const longPercentageAverage = _getAverage(5)
  const shortPercentageAverage = _getAverage(6)
  const netAverage = _getAverage(7)
  return (
    <>
      <form style={{ marginTop: 20 }}>
        <div className='row'>
          <div className='col'>
            <div className='form-group'>
              <label>Exchange</label>
              <Select>
                {exchanges.map(exchange =>
                  <option
                    key={exchange}
                    selected={exchange === selectedExchange}
                    value={`${getPagePath({
                      selectedExchange: exchange,
                      selectedMarket: Object.keys(data[exchange])[0],
                      selectedTraderCategory
                    })}`}
                  >{exchange}</option>
                )}
              </Select>
            </div>
          </div>
          <div className='col'>
            <div className='form-group'>
              <label>Market</label>
              <Select>
                {markets.map(market =>
                  <option
                    key={market}
                    selected={market === selectedMarket}
                    value={`${getPagePath({
                      selectedExchange: selectedExchange,
                      selectedMarket: market,
                      selectedTraderCategory
                    })}`}
                  >{market}</option>
                )}
              </Select>
            </div>
          </div>
          <div className='col'>
            <div className='form-group'>
              <label>Trader</label>
              <Select>
                {traderCategories.map(traderCategory =>
                  <option
                    key={traderCategory}
                    selected={traderCategory === selectedTraderCategory}
                    value={`${getPagePath({
                      selectedExchange: selectedExchange,
                      selectedMarket: selectedMarket,
                      selectedTraderCategory: traderCategory
                    })}`}
                  >{traderCategory}</option>
                )}
              </Select>
            </div>
          </div>
        </div>
        {/* Enable page navigation after selecting a dropdown option */}
        <script dangerouslySetInnerHTML={{
          __html: `
          Array
            .from(document.getElementsByClassName('js-dropdown-select'))
            .forEach(element => element.addEventListener('change', () => {
              window.location = element.value + '.html'
            }))
        `
        }}/>
      </form>
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
    </>
  )
}

const Link = (props: React.HTMLProps<HTMLAnchorElement>) => (
  <a
    href={props.href}
    title={props.title}
    className='text-dark'
    target='_blank'
    rel='noopener noreferrer'
  >
    {props.children}
  </a>
)

interface UsefulLinkProps {
  link: string,
  title: string,
  channel: string
}

const UsefulLink = ({ link, title, channel }: UsefulLinkProps) => (
  <li className='useful-link'>
    <Link href={link} title={`${channel} - ${title}`}>
      <strong>{channel}</strong> - {title}
    </Link>
  </li>
)

const Header = ({ children }: { children: ReactNode }) => (
  <header className='blog-header py-3'>
    <div className='row flex-nowrap justify-content-between align-items-center'>
      {children}
    </div>
  </header>
)

interface TemplateProps {
  tableData: DataTableProps
}

export const Template = ({ tableData }: TemplateProps): JSX.Element => (
  <React.StrictMode>
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <title>COT Perspective</title>
        <meta name='description' content='A pleasant way to view COT data' />
        <meta name='author' content='Brazilian Bull <contact@brbull.club>' />
        <link rel='stylesheet' href='https://bootswatch.com/4/cosmo/bootstrap.min.css' />
        <style>{styles}</style>
      </head>
      <body>
        <div className='container'>
          <Header>
            <div className='col-4 pt-1'>
              <Link href='https://github.com/brbull/cotperspective'>
                📄 Source Code
              </Link>
            </div>
            <div className='col-4 text-center'>
              <a className='blog-header-logo text-dark' href='/'>COT Perspective</a>
            </div>
            <div className='col-4 d-flex justify-content-end align-items-center'>
              <Link href='https://ko-fi.com/brbull'>
                ❤️ Support This Project
              </Link>
            </div>
          </Header>
          <DataTable {...tableData} />
          <Header>
            <div className='col-12'>
              <h3>Useful Links</h3>
            </div>
          </Header>
          <div className='row mb-2' style={{ paddingTop: 20 }}>
            <ul>
              <UsefulLink
                link='https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm'
                channel='CFTC'
                title='Commitments of Traders (COT) Reports Descriptions'
              />
              <UsefulLink
                link='https://www.youtube.com/watch?v=2EpSaM2H540'
                channel='Transparent Fx Academy'
                title='How To Read The COMMITMENT OF TRADERS - COT Report'
              />
              <UsefulLink
                link='https://www.youtube.com/watch?v=mjaWvU6tzrM'
                channel='Magic Trader FX'
                title='CFTC COT Report Understanding the Institutions'
              />
              <UsefulLink
                link='https://www.instagram.com/_brbull/'
                channel='Developed By'
                title='Brazilian Bull @_brbull'
              />
            </ul>
          </div>
          <div className='row mb-2' style={{ paddingTop: 20, paddingBottom: 30 }}>
            <div className='container text-justify'>
              <small>
                {license}
              </small>
            </div>
          </div>
        </div>
      </body>
    </html>
  </React.StrictMode>
)
