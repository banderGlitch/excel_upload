/**
 * @deprecated Use src/api/mockDb.js + src/api/poolApi.js instead.
 * Kept as a thin re-export so older imports do not break.
 */
export { MOCK_API_RECORDS as MOCK_POOL_RECORDS } from '../api/mockDb'
import { MOCK_API_RECORDS } from '../api/mockDb'
import { apiRecordToUi } from '../api/normalize'

export function getMockRecordsForPool(poolId) {
  return (MOCK_API_RECORDS[poolId] ?? []).map(apiRecordToUi)
}
