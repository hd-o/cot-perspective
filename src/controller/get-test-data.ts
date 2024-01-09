import { testData } from '../model/test-data'
import { COTData } from '../model/types'
import { GetDataConfig } from './get-data'
import { Use } from './resolve-container'

type GetTestData = (data?: GetDataConfig) => Promise<COTData>

export const useGetTestData: Use<GetTestData> = () => {
  return async () => testData
}
