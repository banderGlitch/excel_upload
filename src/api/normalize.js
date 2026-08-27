/**
 * Maps between API PoolRecord shape and the flat row used by UI components.
 *
 * API:  { id, values, status, remark, errorKeys }
 * UI:   { id, ...values, recordStatus, remark, errorKeys }
 */

import { API_RECORD_STATUS } from './contracts'
import { getUploadColumns } from '../data/poolTemplates'

export function apiRecordToUi(apiRecord) {
  return {
    id: apiRecord.id,
    ...(apiRecord.values ?? {}),
    recordStatus: apiRecord.status ?? API_RECORD_STATUS.RECEIVED,
    remark: apiRecord.remark ?? '',
    errorKeys: [...(apiRecord.errorKeys ?? [])],
  }
}

export function uiRecordToApi(uiRecord, template) {
  const values = {}
  const uploadKeys = new Set(
    getUploadColumns(template).map((column) => column.key),
  )

  // Prefer uploadable template keys; fall back to non-meta keys on the row
  if (uploadKeys.size) {
    for (const key of uploadKeys) {
      values[key] = String(uiRecord[key] ?? '')
    }
  } else {
    for (const [key, value] of Object.entries(uiRecord)) {
      if (['id', 'recordStatus', 'remark', 'errorKeys'].includes(key)) continue
      values[key] = value
    }
  }

  return {
    id: uiRecord.id,
    values,
    status: uiRecord.recordStatus ?? API_RECORD_STATUS.RECEIVED,
    remark: uiRecord.remark ?? '',
    errorKeys: [...(uiRecord.errorKeys ?? [])],
  }
}

/** Build API record from Excel grid row values (new upload — no status/remark) */
export function gridRowToApiRecord(id, values) {
  return {
    id,
    values: { ...values },
    status: API_RECORD_STATUS.RECEIVED,
    remark: '',
    errorKeys: [],
  }
}
