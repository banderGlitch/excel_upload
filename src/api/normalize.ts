/**
 * Maps between API PoolRecord shape and the flat row used by UI components.
 *
 * API:  { id, values, status, remark, errorKeys }
 * UI:   { id, ...values, recordStatus, remark, errorKeys }
 */

import {
  API_RECORD_STATUS,
  type PoolRecord,
  type PoolRecordValues,
  type PoolTemplate,
  type UiPoolRecord,
} from './contracts'
import { getUploadColumns } from '../data/poolTemplates'

export function apiRecordToUi(apiRecord: PoolRecord): UiPoolRecord {
  return {
    id: apiRecord.id,
    ...(apiRecord.values ?? {}),
    recordStatus: apiRecord.status ?? API_RECORD_STATUS.RECEIVED,
    remark: apiRecord.remark ?? '',
    errorKeys: [...(apiRecord.errorKeys ?? [])],
  }
}

export function uiRecordToApi(
  uiRecord: UiPoolRecord,
  template?: PoolTemplate | null,
): PoolRecord {
  const values: PoolRecordValues = {}
  const uploadKeys = new Set(
    getUploadColumns(template).map((column) => column.key),
  )

  if (uploadKeys.size) {
    for (const key of uploadKeys) {
      values[key] = String(uiRecord[key] ?? '')
    }
  } else {
    for (const [key, value] of Object.entries(uiRecord)) {
      if (['id', 'recordStatus', 'remark', 'errorKeys'].includes(key)) continue
      values[key] = String(value ?? '')
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
export function gridRowToApiRecord(
  id: string,
  values: PoolRecordValues,
): PoolRecord {
  return {
    id,
    values: { ...values },
    status: API_RECORD_STATUS.RECEIVED,
    remark: '',
    errorKeys: [],
  }
}
