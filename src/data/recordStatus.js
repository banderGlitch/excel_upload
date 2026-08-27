/**
 * Pipeline / record status (API field: `status` on PoolRecord).
 * UI stores this as `recordStatus` after normalize (see src/api/normalize.js)
 * so it never clashes with a business column named `status`.
 */
export { API_RECORD_STATUS as RECORD_STATUS } from '../api/contracts'

export const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'received', label: 'Received' },
  { id: 'validated', label: 'Validated' },
  { id: 'failed', label: 'Failed' },
]

export function normalizeStatus(status) {
  return String(status ?? '').trim().toLowerCase()
}

export function isFailedStatus(status) {
  return normalizeStatus(status) === 'failed'
}
