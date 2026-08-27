/**
 * @deprecated Use src/api/mockDb.ts + src/api/poolApi.ts instead.
 * Kept as a thin re-export so older imports do not break.
 */
export { MOCK_API_RECORDS as MOCK_POOL_RECORDS } from '../api/mockDb'
import { MOCK_API_RECORDS } from '../api/mockDb'
import { apiRecordToUi } from '../api/normalize'
import type { UiPoolRecord } from '../api/contracts'

export function getMockRecordsForPool(poolId: string): UiPoolRecord[] {
  return (MOCK_API_RECORDS[poolId] ?? []).map(apiRecordToUi)
}
