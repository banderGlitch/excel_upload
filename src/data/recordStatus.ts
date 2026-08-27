/**
 * Pipeline / record status (API field: `status` on PoolRecord).
 * UI stores this as `recordStatus` after normalize (see src/api/normalize.ts)
 * so it never clashes with a business column named `status`.
 */
export { API_RECORD_STATUS as RECORD_STATUS } from '../api/contracts'
export type { ApiRecordStatus } from '../api/contracts'

export const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'received', label: 'Received' },
  { id: 'validated', label: 'Validated' },
  { id: 'failed', label: 'Failed' },
] as const

export type StatusFilterId = (typeof STATUS_FILTERS)[number]['id']

export function normalizeStatus(status: unknown): string {
  return String(status ?? '').trim().toLowerCase()
}

export function isFailedStatus(status: unknown): boolean {
  return normalizeStatus(status) === 'failed'
}
