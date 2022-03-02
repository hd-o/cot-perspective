import fs from 'fs'
import React, { ReactNode } from 'react'
import { DataTable, DataTableProps } from './data-table'
import { PageDropDowns, PageDropDownsProps } from './page-dropdowns'

const license = fs.readFileSync('./LICENSE').toString()

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
  dropDownsData: PageDropDownsProps
  tableData: DataTableProps
}

export const Template = ({ tableData, dropDownsData }: TemplateProps): JSX.Element => (
  <React.StrictMode>
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <title>COT Perspective • Delightful COT Reports</title>
        <meta name='description' content='Delightful COT Reports' />
        <meta name='author' content='Hadrian de Oliveira' />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="COT Perspective" />
        <meta property="og:title" content="COT Perspective • Delightful COT Reports" />
        <meta property="og:description" content="Delightful COT Reports" />
        <meta property="og:image" content="https://cotperspective.com/preview.png" />
        <meta property="og:url" content="https://cotperspective.com" />
        <link rel='stylesheet' href='https://bootswatch.com/4/cosmo/bootstrap.min.css' />
        <link rel='stylesheet' href='styles.css' />
      </head>
      <body>
        <div id='cotperspective' className='container'>
          <Header>
            <div className='col-4 pt-1' />
            <div className='col-4 text-center'>
              <a className='blog-header-logo text-dark' href='/'>COT Perspective</a>
            </div>
            <div className='col-4 d-flex justify-content-end align-items-center' />
          </Header>
          <PageDropDowns {...dropDownsData} />
          <DataTable {...tableData} />
          <Header>
            <div className='col-12'>
              <h3>Useful Links</h3>
            </div>
          </Header>
          <div className='row mb-2' style={{ paddingTop: 20 }}>
            <ul>
              <UsefulLink
                link='https://github.com/hd-o/cotperspective'
                channel='Source Code'
                title='github.com/hd-o/cotperspective'
              />
              <UsefulLink
                link='https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm'
                channel='CFTC'
                title='Commitments of Traders (COT) Reports Descriptions'
              />
              <UsefulLink
                link='https://www.youtube.com/watch?v=mjaWvU6tzrM'
                channel='Magic Trader FX'
                title='CFTC COT Report Understanding the Institutions'
              />
              <UsefulLink
                link='https://www.youtube.com/watch?v=2EpSaM2H540'
                channel='Transparent Fx Academy'
                title='How To Read The COMMITMENT OF TRADERS - COT Report'
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
